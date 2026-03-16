import os
import requests
import json
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

token = os.getenv("FB_MARKETING_API_TOKEN")

def audit_account(account_id):
    if not token:
        print("Error: FB_MARKETING_API_TOKEN not found in environment.")
        return

    # Ensure ID starts with act_
    if not account_id.startswith("act_"):
        account_id = f"act_{account_id}"

    print(f"Starting Detailed Audit for Account: {account_id}")
    
    # 1. Account Summary
    summary_url = f"https://graph.facebook.com/v19.0/{account_id}"
    summary_params = {
        "fields": "name,account_status,currency,amount_spent,balance,created_time",
        "access_token": token
    }
    res_summary_raw = requests.get(summary_url, params=summary_params)
    print(f"Summary Response Status: {res_summary_raw.status_code}")
    if res_summary_raw.status_code != 200:
        print(f"Raw Response: {res_summary_raw.text}")
        return
    res_summary = res_summary_raw.json()
    
    # Correction: amount_spent is returned in cents (smallest unit of currency)
    raw_amount = int(res_summary.get("amount_spent", 0))
    res_summary["amount_spent_formatted"] = raw_amount / 100
    
    print(f"\n[ACCOUNT SUMMARY]")
    print(json.dumps(res_summary, indent=2))
    print(f"Total Spent (Corrected): {res_summary['amount_spent_formatted']} {res_summary.get('currency')}")

    # 2. Key Insights (Last 30 Days)
    insights_url = f"https://graph.facebook.com/v19.0/{account_id}/insights"
    insights_params = {
        "level": "account",
        "date_preset": "last_30d",
        "fields": "spend,impressions,clicks,ctr,cpc,cpp,reach,conversions,purchase_roas",
        "access_token": token
    }
    res_insights = requests.get(insights_url, params=insights_params).json()
    print(f"\n[INSIGHTS - LAST 30 DAYS]")
    print(json.dumps(res_insights, indent=2))

    # 3. Active Campaigns
    campaigns_url = f"https://graph.facebook.com/v19.0/{account_id}/campaigns"
    campaigns_params = {
        "fields": "name,status,objective,effective_status",
        "filtering": '[{"field":"effective_status","operator":"IN","value":["ACTIVE","PAUSED"]}]',
        "access_token": token
    }
    res_campaigns = requests.get(campaigns_url, params=campaigns_params).json()
    campaigns = res_campaigns.get("data", [])
    print(f"\n[CAMPAIGNS (ACTIVE/PAUSED) - Total: {len(campaigns)}]")
    for camp in campaigns:
        print(f"- {camp.get('name')} | Status: {camp.get('effective_status')} | Obj: {camp.get('objective')}")

    # 4. Ad Sets (Targeting & Budget)
    adsets_url = f"https://graph.facebook.com/v19.0/{account_id}/adsets"
    adsets_params = {
        "fields": "name,effective_status,daily_budget,lifetime_budget,targeting,optimization_goal",
        "filtering": '[{"field":"effective_status","operator":"IN","value":["ACTIVE"]}]',
        "access_token": token
    }
    res_adsets_raw = requests.get(adsets_url, params=adsets_params)
    adsets = res_adsets_raw.json().get("data", [])
    print(f"\n[AD SETS (ACTIVE) - Total: {len(adsets)}]")
    for ads in adsets:
        budget = ads.get('daily_budget') or ads.get('lifetime_budget')
        b_val = int(budget)/100 if budget else 0
        print(f"- {ads.get('name')} | Budget: {b_val} {res_summary.get('currency', '')} | Goal: {ads.get('optimization_goal')}")
        print(f"  Targeting: {json.dumps(ads.get('targeting', {}), indent=2)}")

    # 5. Ads Preview/Status
    ads_url = f"https://graph.facebook.com/v19.0/{account_id}/ads"
    ads_params = {
        "fields": "name,effective_status,creative{name,title,body,image_url,thumbnail_url}",
        "filtering": '[{"field":"effective_status","operator":"IN","value":["ACTIVE"]}]',
        "access_token": token
    }
    res_ads_raw = requests.get(ads_url, params=ads_params)
    all_ads = res_ads_raw.json().get("data", [])
    print(f"\n[ADS (ACTIVE) - Total: {len(all_ads)}]")
    for ad in all_ads:
        body = ad.get('creative', {}).get('body', '')
        snippet = body[:100] if body else "No text"
        print(f"- {ad.get('name')} | Snippet: {snippet}...")
        print(f"  Creative Link: {ad.get('creative', {}).get('image_url') or ad.get('creative', {}).get('thumbnail_url')}")


if __name__ == "__main__":
    # ORFLIE GERAL Account ID
    ORFLIE_ACCOUNT_ID = "4102226916661284"
    audit_account(ORFLIE_ACCOUNT_ID)
