import os
import requests
import json
from dotenv import load_dotenv

load_dotenv()
token = os.getenv("FB_MARKETING_API_TOKEN")
account_id = "act_4102226916661284"

def get_full_audit():
    print(f"--- ORFLIE ADS AUDIT 2026 ---")
    
    # 1. Active Campaign and Ads
    url = f"https://graph.facebook.com/v19.0/{account_id}/campaigns"
    params = {
        "fields": "name,objective,ads{name,creative{body,title,image_url}}",
        "filtering": '[{"field":"effective_status","operator":"IN","value":["ACTIVE"]}]',
        "access_token": token
    }
    res = requests.get(url, params=params).json()
    
    audit_data = {
        "account": "ORFLIE GERAL",
        "active_campaigns": []
    }
    
    for camp in res.get("data", []):
        camp_info = {
            "name": camp.get("name"),
            "objective": camp.get("objective"),
            "ads": []
        }
        for ad in camp.get("ads", {}).get("data", []):
            creative = ad.get("creative", {})
            camp_info["ads"].append({
                "name": ad.get("name"),
                "copy": creative.get("body", ""),
                "headline": creative.get("title", "")
            })
        audit_data["active_campaigns"].append(camp_info)

    # 2. Insights 
    url_ins = f"https://graph.facebook.com/v19.0/{account_id}/insights"
    params_ins = {
        "date_preset": "last_30d",
        "fields": "spend,impressions,ctr,cpc,conversions",
        "access_token": token
    }
    ins_res = requests.get(url_ins, params_ins).json()
    audit_data["insights_30d"] = ins_res.get("data", [{}])[0]

    with open("orflie_audit_report.json", "w", encoding="utf-8") as f:
        json.dump(audit_data, f, indent=2, ensure_ascii=False)
    
    print("Audit saved to orflie_audit_report.json")

if __name__ == "__main__":
    get_full_audit()
