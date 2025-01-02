'use client'

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Upload } from 'lucide-react'

export default function ComplaintForm() {
    return (
        <div className="max-w-3xl mx-auto p-4">
            <Card className="p-6 shadow-none">
                <form className="space-y-4">
                    <h1 className="text-xl font-semibold text-center mb-6">Complaint</h1>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Select defaultValue="vehicle-accident">
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="vehicle-accident">Vehicle Accident</SelectItem>
                                    <SelectItem value="maintenance">Maintenance</SelectItem>
                                    <SelectItem value="vio">V.I.O Related</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="date">Date</Label>
                                <Input
                                    type="date"
                                    id="date"
                                    defaultValue="2024-02-11"
                                    className="bg-gray-50"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="time">Time</Label>
                                <Input
                                    type="time"
                                    id="time"
                                    defaultValue="09:30"
                                    className="bg-gray-50"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <Input
                                    id="location"
                                    defaultValue="Wuse"
                                    className="bg-gray-50"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="fleet-manager">Fleet Manager</Label>
                                <Input
                                    id="fleet-manager"
                                    defaultValue="Elijah Haruna"
                                    className="bg-gray-50"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="explanation">Give a detailed explanation</Label>
                            <Textarea
                                id="explanation"
                                placeholder="During my work hours..."
                                className="min-h-[100px] bg-gray-50"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="border-2 border-dashed rounded-lg p-4 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                                <input
                                    type="file"
                                    id="image"
                                    className="hidden"
                                    accept="image/*"
                                />
                                <label htmlFor="image" className="cursor-pointer">
                                    <Upload className="h-6 w-6 mx-auto mb-2 text-gray-400" />
                                    <span className="text-sm text-gray-500">Upload image</span>
                                </label>
                            </div>
                            <p className="text-xs text-red-500">Compulsory</p>
                        </div>
                    </div>

                    <Button className="w-full bg-black text-white hover:bg-gray-900" size="lg">
                        Submit
                    </Button>
                </form>
            </Card>
        </div>
    )
}

