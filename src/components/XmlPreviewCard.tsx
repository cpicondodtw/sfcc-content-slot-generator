import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Download } from "lucide-react";
import type { ConfigurationPair } from "../types";

type Props = {
  pairs: ConfigurationPair[];
  xmlOutput: string;
  copied: boolean;
  onCopy: () => void;
  onDownload: () => void;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function highlightXml(xml: string) {
  const escaped = escapeHtml(xml);

  return escaped.replace(
    /(&lt;\/?)([\w:-]+)([^&]*?)(\/?&gt;)/g,
    (_, open, tagName, attributes, close) => {
      const highlightedAttributes = attributes.replace(
        /([\w:-]+)=(".*?")/g,
        '<span class="text-amber-300">$1</span>=<span class="text-emerald-300">$2</span>',
      );

      return `${open}<span class="text-sky-300">${tagName}</span>${highlightedAttributes}${close}`;
    },
  );
}

export default function XmlPreviewCard({
  pairs,
  xmlOutput,
  copied,
  onCopy,
  onDownload,
}: Props) {
  return (
    <Card className="sticky top-6 rounded-2xl shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Generated XML</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCopy}>
            <Copy className="mr-2 h-4 w-4" />
            {copied ? "Copied" : "Copy XML"}
          </Button>
          <Button onClick={onDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download XML
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="mb-4 rounded-xl border bg-slate-50 p-4">
          <p className="text-sm font-medium text-slate-900">Category ID Values</p>
          <div className="mt-3 overflow-hidden rounded-lg border bg-white">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="border-b px-3 py-2 text-left font-medium">Slot ID</th>
                  <th className="border-b px-3 py-2 text-left font-medium">Category ID</th>
                </tr>
              </thead>
              <tbody>
                {pairs.map((pair, index) => {
                  const contextIds = Array.from(
                    new Set(
                      [pair.config.contextId, ...pair.assignments.map((assignment) => assignment.contextId)]
                        .map((value) => value.trim())
                        .filter(Boolean),
                    ),
                  );

                  return (
                    <tr key={pair.id} className="align-top">
                      <td className="border-b px-3 py-2 text-slate-900 text-xs">
                        {`Slot ${index + 1}`}
                      </td>
                      <td className="border-b px-3 py-2 text-slate-600 text-xs">
                        {contextIds.length > 0 ? contextIds.join(", ") : "No category ID value"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="max-h-[700px] overflow-auto rounded-xl border bg-slate-950 p-4">
          <pre className="whitespace-pre-wrap break-words font-mono text-xs leading-6 text-slate-100">
            <code
              dangerouslySetInnerHTML={{
                __html: xmlOutput
                  ? highlightXml(xmlOutput)
                  : '<span class="text-slate-500">XML preview will appear here.</span>',
              }}
            />
          </pre>
        </div>
      </CardContent>
    </Card>
  );
}
