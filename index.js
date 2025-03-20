import functions from "@google-cloud/functions-framework";
import { APIResponseError, Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";
import { z } from "zod";

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const n2m = new NotionToMarkdown({ notionClient: notion });

const schema = z.object({
  id: z.string(),
});

functions.http("notionToMd", async (req, res) => {
  const parseResult = schema.safeParse(req.body);
  if (!parseResult.success) {
    console.error(parseResult.error);
    res.status(400).send("Bad request");
    return;
  }

  const { id } = parseResult.data;
  try {
    const mdblocks = await n2m.pageToMarkdown(id);
    const mdString = n2m.toMarkdownString(mdblocks);
    res
      .status(200)
      .header("Content-Type", "text/markdown;charset=utf-8")
      .send(mdString.parent);
  } catch (e) {
    if (APIResponseError.isAPIResponseError(e)) {
      res.status(e.status).send(e.message);
      return;
    }
    console.error(e);
    res.status(500).send("Internal server error");
  }
});
