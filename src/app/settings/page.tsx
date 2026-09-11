"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Save, Check } from "lucide-react"

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [isAutoPassEnabled, setIsAutoPassEnabled] = useState(true)

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      setIsSaved(true)
      setTimeout(() => setIsSaved(false), 2000)
    }, 800)
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Settings</h2>
        <p className="text-slate-500 mt-1">Manage your account settings and preferences.</p>
      </div>

      <Card className="shadow-sm border-slate-200">
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your inspector profile details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input defaultValue="Nandini Tarode" />
            </div>
            <div className="space-y-2">
              <Label>Employee ID</Label>
              <Input defaultValue="LM-INSP-2026" disabled />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input defaultValue="tarodenandini@gmail.com" />
            </div>
            <div className="space-y-2">
              <Label>Region/Zone</Label>
              <Input defaultValue="Maharashtra Zone 1" />
            </div>
          </div>
          <Button 
            onClick={handleSave}
            disabled={isSaving || isSaved}
            className={`mt-4 ${isSaved ? 'bg-green-600 hover:bg-green-700' : 'bg-slate-900 hover:bg-slate-800'} text-white transition-colors`}
          >
            {isSaving ? (
              <>Saving...</>
            ) : isSaved ? (
              <><Check className="mr-2 h-4 w-4" /> Saved Successfully</>
            ) : (
              <><Save className="mr-2 h-4 w-4" /> Save Changes</>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-slate-200">
        <CardHeader>
          <CardTitle>System Preferences</CardTitle>
          <CardDescription>Configure ScanSure AI defaults.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg bg-slate-50">
            <div>
              <p className="font-medium text-sm text-slate-900">High Confidence Auto-Pass</p>
              <p className="text-xs text-slate-500">Automatically skip human review if OCR confidence is above 90%.</p>
            </div>
            <Button 
              variant={isAutoPassEnabled ? "default" : "outline"}
              size="sm"
              onClick={() => setIsAutoPassEnabled(!isAutoPassEnabled)}
              className={isAutoPassEnabled ? "bg-slate-900 text-white hover:bg-slate-800" : ""}
            >
              {isAutoPassEnabled ? "Enabled" : "Disabled"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
