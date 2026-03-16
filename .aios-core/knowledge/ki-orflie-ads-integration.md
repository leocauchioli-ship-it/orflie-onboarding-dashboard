# Knowledge Item: Orflie Facebook Marketing API Integration

## Summary
Comprehensive integration of Orflie's main Facebook Ads account with the AIOS-Core framework. This includes API connectivity, 2026 best practices audit, and the creation of a specialized Marketing Agent (Vortex).

## Context
- **Account Name**: ORFLIE GERAL
- **Account ID**: 4102226916661284
- **Currency**: BRL
- **Historical Spend**: R$ 5,323.97 (Corrected from raw API cents)
- **Token**: Stored in root `.env` as `FB_MARKETING_API_TOKEN`

## Technical Components
1. **Connector Script**: `scripts/orflie-ads-connector.py` - Handles OAuth, Account Audits, and Insights.
2. **Dashboard Integation**: Data cross-referenced with `insumos/Orflie-Dashboard-Gestao-v6.xlsx`.
3. **Agent Vortex**: `@marketing-expert` - Located in `.aios-core/development/agents/marketing-expert.md`.
4. **Audit Reports**:
   - `clients/Orflie/2-deliverables/marketing_audit_04_03.md`
   - `clients/Orflie/2-deliverables/Executive_Presentation_Ads_Orflie.md`

## Key Patterns & Lessons
- **Cents Conversion**: Facebook API returns `amount_spent` in cents. Always divide by 100 for BRL.
- **Lead Quality**: Previous WhatsApp campaigns suffered from low-quality leads. 2026 strategy prioritizes "Higher Intent" Lead Forms with mandatory qualification questions (Job Role/Company Size).
- **CTR Benchmark**: Orflie baseline is high (2.31%). Any dip below 1.5% signals creative fatigue or audience mismatch.
- **Priority**: Orflie is the "Master Brand". All other client accounts (Bruto Capital, TES, etc.) should follow the Orflie scale model.

## Active Campaigns (Monitoring)
- `Aberto- Leads-OUT` (ID: 120241236969350337) - Focused on CEO/Management via Video Authority.

## Reference Files
- [.env](file:///c:/Users/leo.cauchioli/Desktop/aios-core-main/.env)
- [Story: Orflie Ads Integration](file:///c:/Users/leo.cauchioli/Desktop/aios-core-main/docs/stories/active/story-orflie-ads-integration-03-04.md)
- [Marketing Pipeline Workflow](file:///c:/Users/leo.cauchioli/Desktop/aios-core-main/.agents/workflows/marketing-pipeline.md)
