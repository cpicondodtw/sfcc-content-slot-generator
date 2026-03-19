import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Download } from "lucide-react";

type Props = {
  xmlOutput: string;
  copied: boolean;
  onCopy: () => void;
  onDownload: () => void;
};

export default function XmlPreviewCard({ xmlOutput, copied, onCopy, onDownload }: Props) {
  return (
    <Card className="sticky top-6 rounded-2xl shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Generated XML</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCopy}>
            <Copy className="mr-2 h-4 w-4" />
            {copied ? "Copied" : "Copy XML"}
          </Button>
          <Button onClick={onDownload} disabled={!xmlOutput}>
            <Download className="mr-2 h-4 w-4" />
            Download XML
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Textarea value={xmlOutput} readOnly rows={28} className="font-mono text-xs" />
      </CardContent>
    </Card>
  );
}