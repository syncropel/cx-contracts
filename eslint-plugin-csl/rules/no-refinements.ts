// STUB RULE: Placeholder until we implement strict CSL compliance checking
// TODO: Implement actual detection of .refine(), .superRefine() calls on Zod schemas

import { Rule } from "eslint";

const rule: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow .refine() and .superRefine() calls on Zod schemas (CSL compliance)",
      category: "Best Practices",
      recommended: true,
    },
    messages: {
      noRefinements:
        "CSL does not support .refine() or .superRefine() - use only static schema definitions",
    },
    schema: [], // no options
  },
  create(context: Rule.RuleContext) {
    // STUB: Return empty visitor object - doesn't check anything yet
    // When ready to enforce, implement AST visitor to detect .refine() and .superRefine() calls
    return {};
  },
};

export default rule;
