export const duplicateRecords = [
  { id: "r1", label: "Dana Whitfield", meta: "D.Whitfield@northwind.co" },
  { id: "r2", label: "Marcus Oyelaran", meta: "marcus@oyelaran.studio" },
  { id: "r3", label: "Priya Raman", meta: "priya.raman@fieldnote.io" },
];

export const answerConfirmed = `Done. I found 3 duplicate customer records from the November 12 import and deleted them after you approved.

• Dana Whitfield had two entries that differed only in email casing. I kept the one with order history.
• Marcus Oyelaran was imported twice from the same CSV row.
• Priya Raman's duplicate had no activity, so nothing was lost.

The other 1,201 records from that import look clean.`;

export const answerCancelled = `No problem, I left everything as it was. I found 3 likely duplicates from the November 12 import: Dana Whitfield, Marcus Oyelaran and Priya Raman.

If you'd like, I can merge them instead of deleting them, so each customer's history stays in one place.`;

export const answerUndone = `

Update: you undid the deletion, so all 3 records are back exactly as they were.`;
