// @ts-nocheck
import { matchPersons } from "./index.ts";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function jsonResponse(value: unknown, status = 200): Response {
  return new Response(JSON.stringify(value), {
    status,
    headers: { "content-type": "application/json" },
  });
}

Deno.test("matchPersons enriches RCA for the first 20 person matches", async () => {
  const originalFetch = globalThis.fetch;
  const originalOpenRisk = globalThis.openrisk;
  const fetchUrls: string[] = [];

  try {
    globalThis.openrisk = { metrics: { set() {} } };
    globalThis.fetch = async (input: RequestInfo | URL) => {
      const url = typeof input === "string" ? input : input.toString();
      fetchUrls.push(url);

      if (url.includes("/match/default")) {
        return jsonResponse({
          responses: {
            entity1: {
              total: { value: 25 },
              results: Array.from({ length: 25 }, (_, index) => {
                const n = index + 1;
                return {
                  id: `person-${n}`,
                  caption: `Person ${n}`,
                  schema: "Person",
                  properties: {
                    name: [`Person ${n}`],
                    topics: ["role.pep"],
                  },
                  datasets: ["test"],
                  score: 0.9,
                  match: true,
                  explanations: {},
                };
              }),
            },
          },
        });
      }

      const entityId = decodeURIComponent(new URL(url).pathname.split("/").pop() ?? "");
      return jsonResponse({
        id: entityId,
        caption: entityId,
        schema: "Person",
        properties: {
          name: [entityId],
          familyRelative: [
            {
              id: `family-${entityId}`,
              caption: "Family",
              schema: "Family",
              properties: {
                person: [
                  {
                    id: `relative-${entityId}`,
                    caption: `Relative ${entityId}`,
                    schema: "Person",
                    properties: {
                      name: [`Relative ${entityId}`],
                    },
                  },
                ],
                relative: [entityId],
                relationship: ["spouse"],
              },
            },
          ],
        },
      });
    };

    const result = await matchPersons({
      search_input: "Person",
      token: "test-token",
      dataset: "default",
      limit: 25,
    });

    const entityCalls = fetchUrls.filter((url) => url.includes("/entities/"));
    assert(entityCalls.length === 20, `expected 20 RCA enrichment calls, got ${entityCalls.length}`);

    const firstRca = result[0].$props?.relativeCloseAssociates?.[0]?.value;
    assert(firstRca?.name === "Relative person-1", `unexpected first RCA: ${JSON.stringify(firstRca)}`);
    assert(firstRca?.relation === "spouse", `unexpected first relation: ${JSON.stringify(firstRca)}`);

    const twentiethRca = result[19].$props?.relativeCloseAssociates?.[0]?.value;
    assert(twentiethRca?.name === "Relative person-20", `unexpected twentieth RCA: ${JSON.stringify(twentiethRca)}`);

    assert(
      !result[20].$props?.relativeCloseAssociates,
      "expected match 21 to be left unenriched after the call cap",
    );
  } finally {
    globalThis.fetch = originalFetch;
    globalThis.openrisk = originalOpenRisk;
  }
});

Deno.test("matchPersons omits explanations JSON from extras", async () => {
  const originalFetch = globalThis.fetch;
  const originalOpenRisk = globalThis.openrisk;

  try {
    globalThis.openrisk = { metrics: { set() {} } };
    globalThis.fetch = async (input: RequestInfo | URL) => {
      const url = typeof input === "string" ? input : input.toString();

      if (url.includes("/match/default")) {
        return jsonResponse({
          responses: {
            entity1: {
              total: { value: 1 },
              results: [
                {
                  id: "person-1",
                  caption: "Person 1",
                  schema: "Person",
                  properties: {
                    name: ["Person 1"],
                    topics: ["role.pep"],
                  },
                  datasets: ["test"],
                  score: 0.9,
                  match: true,
                  explanations: {
                    name_match: {
                      score: 0.9,
                    },
                  },
                },
              ],
            },
          },
        });
      }

      const entityId = decodeURIComponent(new URL(url).pathname.split("/").pop() ?? "");
      return jsonResponse({
        id: entityId,
        caption: entityId,
        schema: "Person",
        properties: {
          name: [entityId],
        },
      });
    };

    const result = await matchPersons({
      search_input: "Person",
      token: "test-token",
      dataset: "default",
      limit: 1,
    });

    const extraKeys = result[0].$extra?.map((item) => item.value.key.value) ?? [];
    assert(
      !extraKeys.includes("Explanations Json"),
      `expected explanations_json to be omitted from extras: ${JSON.stringify(extraKeys)}`,
    );
  } finally {
    globalThis.fetch = originalFetch;
    globalThis.openrisk = originalOpenRisk;
  }
});
