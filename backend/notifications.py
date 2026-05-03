"""Lead notification helpers (Resend email + Twilio SMS).

Both sends are non-blocking and fail-silent so a lead capture never fails
because of a notification provider being slow / misconfigured.
"""
from __future__ import annotations

import asyncio
import logging
import os
from typing import Any

logger = logging.getLogger(__name__)


def _env(name: str) -> str:
    return (os.environ.get(name) or "").strip()


def _build_email_html(lead: dict[str, Any]) -> str:
    name = lead.get("name", "")
    business = lead.get("business") or "—"
    phone = lead.get("phone", "")
    email = lead.get("email", "")
    source = lead.get("source", "landing-cta")
    variant = lead.get("variant") or "—"
    created = lead.get("created_at") or ""
    return f"""
    <table width="100%" cellpadding="0" cellspacing="0" style="font-family:Arial,Helvetica,sans-serif;background:#f8fafc;padding:24px;">
      <tr><td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #e2e8f0;">
          <tr><td style="background:#020817;padding:18px 24px;color:#ffffff;">
            <div style="font-size:11px;letter-spacing:.22em;color:#60a5fa;font-weight:700;">SERVICESPEAK · NEW LEAD</div>
            <div style="font-size:22px;font-weight:800;margin-top:4px;">{name}</div>
            <div style="font-size:13px;color:#cbd5e1;margin-top:2px;">{business}</div>
          </td></tr>
          <tr><td style="padding:24px;color:#0f172a;font-size:14px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              {''.join(_row(k, v) for k, v in [
                  ('Phone', phone),
                  ('Email', email),
                  ('Source', source),
                  ('Variant', variant),
                  ('Captured', created),
              ])}
            </table>
            <div style="margin-top:24px;padding:14px 16px;background:#dbeafe;border-left:4px solid #2563eb;color:#1e3a8a;font-size:13px;">
              Call them within 5 minutes for a 9× higher conversion rate.
            </div>
          </td></tr>
          <tr><td style="padding:14px 24px;background:#f1f5f9;color:#64748b;font-size:11px;letter-spacing:.18em;text-transform:uppercase;font-weight:700;">
            ServiceSpeak AI · Lead Notification
          </td></tr>
        </table>
      </td></tr>
    </table>
    """


def _row(k: str, v: str) -> str:
    return (
        f'<tr><td style="padding:6px 0;color:#64748b;font-size:12px;'
        f'text-transform:uppercase;letter-spacing:.12em;font-weight:700;width:90px;">{k}</td>'
        f'<td style="padding:6px 0;color:#020817;font-weight:600;">{v}</td></tr>'
    )


def _send_email_sync(lead: dict[str, Any]) -> dict[str, Any] | None:
    api_key = _env("RESEND_API_KEY")
    sender = _env("SENDER_EMAIL") or "onboarding@resend.dev"
    recipient = _env("LEAD_NOTIFY_EMAIL")
    if not api_key or not recipient:
        logger.info("Resend skipped — RESEND_API_KEY or LEAD_NOTIFY_EMAIL missing.")
        return None

    import resend  # local import so the app starts without the dep installed

    resend.api_key = api_key
    params = {
        "from": sender,
        "to": [recipient],
        "subject": f"New lead · {lead.get('name', '')} ({lead.get('business') or 'no business'})",
        "html": _build_email_html(lead),
    }
    return resend.Emails.send(params)


def _send_sms_sync(lead: dict[str, Any]) -> Any | None:
    sid = _env("TWILIO_ACCOUNT_SID")
    token = _env("TWILIO_AUTH_TOKEN")
    from_num = _env("TWILIO_FROM_NUMBER")
    to_num = _env("LEAD_NOTIFY_PHONE")
    if not all([sid, token, from_num, to_num]):
        logger.info("Twilio SMS skipped — one or more credentials missing.")
        return None

    from twilio.rest import Client

    client = Client(sid, token)
    body = (
        f"ServiceSpeak — New lead!\n"
        f"{lead.get('name', '')} · {lead.get('business') or 'no business'}\n"
        f"{lead.get('phone', '')} · {lead.get('email', '')}\n"
        f"Variant: {lead.get('variant') or '—'}"
    )
    return client.messages.create(body=body, from_=from_num, to=to_num)


async def notify_new_lead(lead: dict[str, Any]) -> dict[str, Any]:
    """Fire both email + SMS concurrently. Never raises."""
    async def _safe(name: str, fn):
        try:
            result = await asyncio.to_thread(fn, lead)
            if result is None:
                logger.info("Lead notification skipped (%s).", name)
                return {"channel": name, "status": "skipped"}
            logger.info("Lead notification sent (%s).", name)
            return {"channel": name, "status": "sent"}
        except Exception as exc:  # noqa: BLE001 — we never want notifications to crash leads
            logger.warning("Lead notification failed (%s): %s", name, exc)
            return {"channel": name, "status": "error", "detail": str(exc)}

    email_task = asyncio.create_task(_safe("email", _send_email_sync))
    sms_task = asyncio.create_task(_safe("sms", _send_sms_sync))
    results = await asyncio.gather(email_task, sms_task, return_exceptions=False)
    return {"results": results}
