"""Daily lead-roundup email.

Runs once per day via APScheduler, queries yesterday's leads, aggregates by
variant and emails a compact HTML digest using the existing Resend integration.
"""
from __future__ import annotations

import logging
import os
from datetime import datetime, timedelta, timezone

logger = logging.getLogger(__name__)


def _fmt_time(dt_iso: str) -> str:
    try:
        dt = datetime.fromisoformat(dt_iso.replace("Z", "+00:00"))
        return dt.strftime("%H:%M UTC")
    except Exception:
        return dt_iso or "—"


def _render_digest_html(day_label: str, leads: list[dict], totals: dict[str, int]) -> str:
    rows = ""
    for lead in leads[:50]:
        rows += f"""
        <tr>
          <td style="padding:10px;border-bottom:1px solid #e2e8f0;font-weight:700;">{lead.get('name','')}</td>
          <td style="padding:10px;border-bottom:1px solid #e2e8f0;color:#475569;">{lead.get('business') or '—'}</td>
          <td style="padding:10px;border-bottom:1px solid #e2e8f0;color:#475569;">{lead.get('phone','')}</td>
          <td style="padding:10px;border-bottom:1px solid #e2e8f0;color:#2563eb;font-family:'JetBrains Mono',monospace;font-size:11px;text-transform:uppercase;">{lead.get('variant') or '—'}</td>
          <td style="padding:10px;border-bottom:1px solid #e2e8f0;color:#64748b;font-size:12px;">{_fmt_time(lead.get('created_at') or '')}</td>
        </tr>"""
    if not rows:
        rows = '<tr><td colspan="5" style="padding:24px;text-align:center;color:#94a3b8;">No leads yesterday — quiet day.</td></tr>'

    totals_html = "".join(
        f'<span style="display:inline-block;margin-right:16px;font-size:13px;color:#cbd5e1;"><b style="color:#60a5fa;">{v}</b>&nbsp;{k}</span>'
        for k, v in totals.items()
    )

    return f"""
    <table width="100%" cellpadding="0" cellspacing="0" style="font-family:Arial,Helvetica,sans-serif;background:#f8fafc;padding:24px;">
      <tr><td align="center">
        <table width="680" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #e2e8f0;">
          <tr><td style="background:#020817;padding:22px 28px;color:#ffffff;">
            <div style="font-size:11px;letter-spacing:.22em;color:#60a5fa;font-weight:700;">SERVICESPEAK · DAILY ROUNDUP</div>
            <div style="font-size:26px;font-weight:800;margin-top:6px;">Leads from {day_label}</div>
            <div style="margin-top:10px;">{totals_html}</div>
          </td></tr>
          <tr><td style="padding:0 28px 28px 28px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:18px;font-size:13px;color:#0f172a;">
              <thead>
                <tr style="background:#f1f5f9;">
                  <th align="left" style="padding:10px;font-size:11px;letter-spacing:.15em;text-transform:uppercase;color:#475569;">Lead</th>
                  <th align="left" style="padding:10px;font-size:11px;letter-spacing:.15em;text-transform:uppercase;color:#475569;">Business</th>
                  <th align="left" style="padding:10px;font-size:11px;letter-spacing:.15em;text-transform:uppercase;color:#475569;">Phone</th>
                  <th align="left" style="padding:10px;font-size:11px;letter-spacing:.15em;text-transform:uppercase;color:#475569;">Variant</th>
                  <th align="left" style="padding:10px;font-size:11px;letter-spacing:.15em;text-transform:uppercase;color:#475569;">Captured</th>
                </tr>
              </thead>
              <tbody>{rows}</tbody>
            </table>
          </td></tr>
          <tr><td style="padding:14px 28px;background:#f1f5f9;color:#64748b;font-size:11px;letter-spacing:.18em;text-transform:uppercase;font-weight:700;">
            ServiceSpeak AI · Auto-generated at 09:00 UTC
          </td></tr>
        </table>
      </td></tr>
    </table>
    """


async def send_daily_roundup(db) -> dict:
    """Query yesterday's leads from MongoDB and email a digest via Resend."""
    now = datetime.now(timezone.utc)
    end = now.replace(hour=0, minute=0, second=0, microsecond=0)
    start = end - timedelta(days=1)
    day_label = start.strftime("%b %d, %Y")

    # created_at stored as ISO string — string comparisons work because ISO-8601 is sortable
    cursor = db.leads.find(
        {"created_at": {"$gte": start.isoformat(), "$lt": end.isoformat()}},
        {"_id": 0},
    ).sort("created_at", 1)
    leads = await cursor.to_list(500)

    totals: dict[str, int] = {"total": len(leads)}
    for lead in leads:
        v = lead.get("variant") or "unknown"
        totals[v] = totals.get(v, 0) + 1

    api_key = (os.environ.get("RESEND_API_KEY") or "").strip()
    recipient = (os.environ.get("LEAD_NOTIFY_EMAIL") or "").strip()
    sender = (os.environ.get("SENDER_EMAIL") or "onboarding@resend.dev").strip()
    if not api_key or not recipient:
        logger.info("Daily roundup skipped — RESEND_API_KEY or LEAD_NOTIFY_EMAIL missing.")
        return {"status": "skipped", "leads": len(leads)}

    import resend  # local import keeps app bootable if package missing

    resend.api_key = api_key
    try:
        result = resend.Emails.send({
            "from": sender,
            "to": [recipient],
            "subject": f"ServiceSpeak · {len(leads)} lead{'s' if len(leads) != 1 else ''} yesterday ({day_label})",
            "html": _render_digest_html(day_label, leads, totals),
        })
        logger.info("Daily roundup sent: %s leads for %s.", len(leads), day_label)
        return {"status": "sent", "leads": len(leads), "id": result.get("id")}
    except Exception as exc:  # noqa: BLE001
        logger.warning("Daily roundup failed: %s", exc)
        return {"status": "error", "detail": str(exc)}
