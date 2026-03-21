import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { FileNamingForm } from "../types"
import { getInputClass } from "../utils/validation";

type Props = {
  fileNaming: FileNamingForm
  setFileNaming: (value: FileNamingForm) => void
  downloadFileName: string
}

export default function FileNamingSection({
  fileNaming,
  setFileNaming,
  downloadFileName,
}: Props) {
  const updateField = (key: keyof FileNamingForm, value: string) => {
    setFileNaming({
      ...fileNaming,
      [key]: value,
    })
  }

  return (
    <div className="rounded-xl border bg-white p-4 space-y-2">
      <h2 className="text-lg font-semibold">File Naming</h2>

      <div className="grid md:grid-cols-3 gap-4">

        <div className="space-y-2">
          <Label>Date (YYYYMMDD)</Label>
          <Input
            value={fileNaming.date}
            onChange={(e) => updateField("date", e.target.value)}
            placeholder="202300101"
            className={getInputClass(fileNaming.date)}
          />
        </div>

        <div className="space-y-2">
          <Label>Campaign Name</Label>
          <Input
            value={fileNaming.campaignName}
            onChange={(e) => updateField("campaignName", e.target.value)}
            placeholder="spring-sale"
            className={getInputClass(fileNaming.campaignName)}
          />
        </div>

        <div className="space-y-2">
          <Label>Locale</Label>
          <Input
            value={fileNaming.locale}
            onChange={(e) => updateField("locale", e.target.value)}
            placeholder="fr_FR"
          />
        </div>
      </div>

      <p className="text-sm text-slate-500">
        Download filename: <strong>{downloadFileName}</strong>
      </p>
    </div>
  )
}