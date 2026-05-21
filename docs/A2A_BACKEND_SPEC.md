# A2A Skills Specification — rag-research-tool-backend

## Status

**Phase:** 3 of Frontend Platform Alignment  
**Decision:** Hybrid protocol (REST for CRUD, A2A for agentic workflows)  
**Owner:** Backend team  
**Consumer:** rag-research-tool-frontend (already prepared for A2A client)

---

## Context

The frontend has been upgraded to use the same API client architecture as dev-nexus:
- `src/api/client.ts` — axios factory with interceptors
- `src/hooks/useApprovals.ts`, `useDocuments.ts`, `useEvents.ts` — TanStack Query
- `src/main.tsx` — `QueryClientProvider` + `BrowserRouter`

The frontend is ready to call A2A skills via a new `a2aClient` instance (to be added after backend supports it).

---

## REST Endpoints (Keep — No Changes)

These remain REST. No backend work needed.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/approvals` | List approvals with filters |
| `POST` | `/api/v1/approvals/{id}/approve` | Approve a document |
| `POST` | `/api/v1/approvals/{id}/reject` | Reject a document |
| `GET` | `/api/v1/approvals/history` | Approval history for document |
| `GET` | `/api/v1/documents` | List documents |
| `GET` | `/api/v1/events` | List events |
| `GET` | `/api/v1/audit` | Audit trail |

---

## New A2A Skills (Backend Must Implement)

### Skill: `analyze_event_conflicts`

**When to call:** User wants AI analysis of document conflicts within an event.

**Input:**
```json
{
  "event_id": "evt_123",
  "documents": ["doc_1", "doc_2", "doc_3"],
  "analysis_depth": "standard"
}
```

**Output:**
```json
{
  "success": true,
  "timestamp": "2026-05-21T12:00:00Z",
  "execution_time_ms": 4200,
  "event_id": "evt_123",
  "conflicts": [
    {
      "document_a": "doc_1",
      "document_b": "doc_2",
      "conflict_type": "overlap",
      "severity": "high",
      "description": "Both documents claim exclusive sponsorship rights",
      "affected_sections": ["Section 4.2", "Section 3.1"]
    }
  ],
  "summary": "2 high-severity conflicts found in 3 documents",
  "recommendations": [
    "Escalate to operational lead for resolution"
  ]
}
```

**Frontend hook:**
```typescript
// src/hooks/useEventConflicts.ts (to be added)
import { useQuery } from '@tanstack/react-query';

export function useEventConflicts(eventId: string) {
  return useQuery({
    queryKey: ['event-conflicts', eventId],
    queryFn: () => a2aClient.executeSkill('analyze_event_conflicts', {
      event_id: eventId,
      analysis_depth: 'standard'
    }),
    enabled: !!eventId,
  });
}
```

---

### Skill: `compare_documents`

**When to call:** User wants a semantic diff between two document versions with AI reasoning.

**Input:**
```json
{
  "document_id": "doc_123",
  "version_a": "v1.2",
  "version_b": "v1.3",
  "comparison_mode": "semantic"
}
```

**Output:**
```json
{
  "success": true,
  "timestamp": "2026-05-21T12:00:00Z",
  "execution_time_ms": 3100,
  "document_id": "doc_123",
  "version_a": "v1.2",
  "version_b": "v1.3",
  "differences": [
    {
      "section": "Budget Allocation",
      "change_type": "modified",
      "summary": "Budget increased from $50K to $75K with additional vendor line item",
      "impact": "Requires re-approval from sponsor stage"
    }
  ],
  "similarity_score": 0.82,
  "requires_reapproval": true,
  "affected_approvals": ["approval_456"]
}
```

**Frontend hook:**
```typescript
// src/hooks/useDocumentComparison.ts (to be added)
export function useDocumentComparison(docId: string, versionA: string, versionB: string) {
  return useQuery({
    queryKey: ['doc-compare', docId, versionA, versionB],
    queryFn: () => a2aClient.executeSkill('compare_documents', {
      document_id: docId,
      version_a: versionA,
      version_b: versionB,
      comparison_mode: 'semantic'
    }),
    enabled: !!docId && !!versionA && !!versionB,
  });
}
```

---

### Skill: `suggest_approval_actions`

**When to call:** User wants AI-recommended next steps for an approval queue or event.

**Input:**
```json
{
  "event_id": "evt_123",
  "context": "pre-approval",
  "constraints": ["must_complete_within_48h"]
}
```

**Output:**
```json
{
  "success": true,
  "timestamp": "2026-05-21T12:00:00Z",
  "execution_time_ms": 2800,
  "event_id": "evt_123",
  "suggestions": [
    {
      "action": "approve",
      "target_approval_id": "approval_789",
      "reasoning": "All compliance checks passed. Document matches sponsor requirements.",
      "confidence": 0.94,
      "risk_level": "low"
    },
    {
      "action": "request_changes",
      "target_approval_id": "approval_790",
      "reasoning": "Budget section needs clarification per operational guidelines.",
      "confidence": 0.78,
      "risk_level": "medium",
      "suggested_changes": ["Add vendor justification for $25K increase"]
    }
  ],
  "overall_recommendation": "Proceed with approval_789, defer approval_790 for 24h",
  "estimated_completion_time_hours": 36
}
```

**Frontend hook:**
```typescript
// src/hooks/useApprovalSuggestions.ts (to be added)
export function useApprovalSuggestions(eventId: string) {
  return useQuery({
    queryKey: ['approval-suggestions', eventId],
    queryFn: () => a2aClient.executeSkill('suggest_approval_actions', {
      event_id: eventId,
      context: 'pre-approval'
    }),
    enabled: !!eventId,
  });
}
```

---

## A2A Endpoint Contract

### Request Format

All A2A skills are called via:

```
POST /a2a/execute
Content-Type: application/json
Authorization: Bearer <token>
```

```json
{
  "skill_id": "analyze_event_conflicts",
  "input": { ... }
}
```

### Response Format (Standard Envelope)

```json
{
  "success": true,
  "timestamp": "ISO-8601",
  "execution_time_ms": 1234,
  "error": "optional — present only if success=false",
  "...": "skill-specific fields at root level"
}
```

### Agent Card Endpoint

```
GET /.well-known/agent.json
```

Returns the A2A agent card describing all available skills. The frontend uses this for discovery.

**Example:**
```json
{
  "name": "rag-research-tool-backend",
  "version": "0.1.0",
  "skills": [
    {
      "id": "analyze_event_conflicts",
      "name": "Analyze Event Conflicts",
      "description": "Detects document conflicts within an event",
      "input_schema": { "$ref": "#/$defs/analyze_event_conflicts_input" },
      "output_schema": { "$ref": "#/$defs/analyze_event_conflicts_output" }
    },
    {
      "id": "compare_documents",
      "name": "Compare Documents",
      "description": "Semantic diff between document versions",
      "input_schema": { "$ref": "#/$defs/compare_documents_input" },
      "output_schema": { "$ref": "#/$defs/compare_documents_output" }
    },
    {
      "id": "suggest_approval_actions",
      "name": "Suggest Approval Actions",
      "description": "AI-recommended next steps for approvals",
      "input_schema": { "$ref": "#/$defs/suggest_approval_actions_input" },
      "output_schema": { "$ref": "#/$defs/suggest_approval_actions_output" }
    }
  ]
}
```

---

## Implementation Notes for Backend Team

### Option 1: Add A2A layer alongside REST (Recommended)

Keep all existing FastAPI routes. Add a new router:

```python
# backend/src/a2a/router.py
from fastapi import APIRouter

a2a_router = APIRouter(prefix="/a2a")

@a2a_router.post("/execute")
async def execute_skill(request: ExecuteSkillRequest):
    skill = SKILL_REGISTRY.get(request.skill_id)
    if not skill:
        return {"success": False, "error": f"Unknown skill: {request.skill_id}"}
    return await skill.execute(request.input)

@a2a_router.get("/.well-known/agent.json")
async def get_agent_card():
    return build_agent_card()
```

### Option 2: Wrap existing endpoints as skills

Some skills can delegate to existing REST handlers:

```python
async def analyze_event_conflicts(input: dict):
    # Reuse existing event service
    event = await event_service.get(input["event_id"])
    documents = await document_service.get_many(input["documents"])
    # Add AI analysis layer
    conflicts = await ai_service.detect_conflicts(documents)
    return {
        "success": True,
        "timestamp": now(),
        "execution_time_ms": elapsed,
        "event_id": input["event_id"],
        "conflicts": conflicts
    }
```

---

## Frontend Integration Checklist

After backend implements these skills:

- [ ] Add `A2AClient` instance to rag-research-frontend (copy from dev-nexus)
- [ ] Add `src/services/a2aClient.ts` with `executeSkill(skill_id, input)` method
- [ ] Add `src/hooks/useEventConflicts.ts`
- [ ] Add `src/hooks/useDocumentComparison.ts`
- [ ] Add `src/hooks/useApprovalSuggestions.ts`
- [ ] Add UI components for conflict display, diff viewer, action suggestions
- [ ] Test end-to-end with backend A2A endpoint

---

## References

- dev-nexus A2A client: `dev-nexus-frontend/src/services/a2aClient.ts`
- dev-nexus agent card: `GET /.well-known/agent.json`
- dev-nexus execute endpoint: `POST /a2a/execute`
- Standard response envelope: `StandardSkillResponse` interface in `a2aClient.ts`
