# Deduplication and DMBOK Verification Report

## Exact result

- Existing question bank retained: **490** questions.
- Genuinely new, DMBOK-verified or DMBOK-corrected questions added: **204**.
- Final private study bank: **694** questions.
- Existing IDs changed: **0**.
- Existing browser progress key changed: **0** (`cdmp-progress-v2` remains unchanged).

## Deduplication rule

A source item was treated as a duplicate when it tests the same DMBOK proposition with materially the same answer logic, even if it changes a statement into a true/false or “which is NOT” form. A question was retained when it tests an additional distinction, application, example, or set of details. Every decision is listed in `SOURCE_INTEGRATION_AUDIT.csv` and `.json`.

## Source reconciliation

| Source | Source records reviewed | Added | Duplicates | Excluded after verification |
|---|---:|---:|---:|---:|
| Data Strategy Professionals Set 1–3 (updated) | 150 | 123 | 25 | 2 |
| Data Strategy Professionals Set 3 (legacy/alternate) | 50 | 7 | 43 | 0 |
| DAMA Attempts 1–7 | 106 unique extracted candidates | 74 | 22 | 10 |
| **Total** | **306** | **204** | **90** | **12** |

The seven DAMA Attempt PDFs contain 280 question appearances. Cross-attempt clustering reduced those appearances to 106 extracted candidates; two internal semantic duplicates were then collapsed, leaving 104 canonical DAMA items before comparison with the existing/DSP banks.

## Verification outcomes for added questions

- **Verified without answer change:** 202
- **Corrected against DMBOK:** 2
  - DAMA consistency example: changed from a completeness example to the standard-format example supported by DMBOK.
  - DAMA “Technical Operational Metadata”: normalized to the DMBOK category **Technical Metadata**.
- **Unverified/conflicted questions added:** 0

## Reference-quality checks

- Every one of the **204 added questions** has a DMBOK2 (2017) page reference, a DMBOK2 Revised (2024) page reference, an explanation, and a supporting evidence passage.
- Reference confidence after manual review: **127 high**, **77 medium**, **0 low**. Medium denotes an applied classification or inference supported by DMBOK rather than an exact quoted definition.
- Knowledge-area and printed-page consistency checks found **0 chapter mismatches** after normalization.
- The final embedded HTML dataset is identical to `question_bank.json`, and the application JavaScript passes a syntax check.

## Excluded source problems

Twelve source questions were not added because the supplied DMBOK did not support one unambiguous answer. These include the malformed Plan–Monitor–Act cycle, ambiguous Data Governance “motivation,” unsupported metadata-standard taxonomies, the no-mandatory-artifact claim, and questions whose answer judgment was not stated by DMBOK. Details and source wording are retained in the audit.

## Progress compatibility

The first 490 records retain their original IDs in their original order. The app still reads and writes `cdmp-progress-v2` and `cdmp-user-profile-v1`. New records use separate stable IDs, so existing attempts, missed-question queues, bookmarks, profile data, and chapter history remain available.

## Distribution boundary

This is a **private study edition**. The imported practice material includes redistribution restrictions. Keep this build local or in a private repository unless permission has been obtained from the relevant rights holders.
