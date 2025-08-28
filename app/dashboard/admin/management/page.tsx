'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, BookOpen, Settings } from 'lucide-react'
import SemesterManagement from '@/components/dashboard/semester-management'
import AssessmentManagement from '@/components/dashboard/assessment-management'

export default function AdminManagementPage() {
  const [activeTab, setActiveTab] = useState("semesters")

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Manajemen Sistem</h1>
        <p className="text-muted-foreground">
          Kelola semester, aspek penilaian, dan pengaturan sistem
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="semesters" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Semester
          </TabsTrigger>
          <TabsTrigger value="assessments" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Aspek Penilaian
          </TabsTrigger>
        </TabsList>

        <TabsContent value="semesters" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Manajemen Semester
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SemesterManagement />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assessments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Manajemen Aspek Penilaian
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AssessmentManagement />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
