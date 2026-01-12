import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { MessageSquarePlus, AlertTriangle, MapPin, CheckCircle2, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { delhiWards } from "@/data/mockData";

const complaintTypes = [
    { value: "dust", label: "Dust / Road Dust", icon: "🌫️" },
    { value: "construction", label: "Construction Pollution", icon: "🏗️" },
    { value: "garbage", label: "Garbage Burning", icon: "🔥" },
    { value: "industrial", label: "Industrial Emissions", icon: "🏭" },
    { value: "vehicle", label: "Vehicle Pollution", icon: "🚗" },
    { value: "other", label: "Other", icon: "📝" },
];

export function ComplaintButton() {
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [ticketId, setTicketId] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        ward: "",
        type: "",
        location: "",
        description: "",
    });

    const { data: apiWards = [] } = useQuery<any[]>({ queryKey: ["/api/wards"] });
    const wards = apiWards.length > 0 ? apiWards : delhiWards;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("📝 Submit clicked");

        
        if (!formData.name || !formData.phone || !formData.ward || !formData.type || !formData.location || !formData.description) {
            alert("Please fill in all fields");
            return;
        }

        setIsSubmitting(true);
        console.log("🚀 Sending data...", formData);

        try {
            const res = await fetch("/api/complaints", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (!res.ok) throw new Error("Server error");

            const data = await res.json();
            console.log("✅ Success:", data);
            setTicketId(data.ticketId);
            setSubmitted(true);
        } catch (error) {
            console.error("❌ Failed to submit complaint:", error);
            alert("Failed to submit. Please try again.");
        }
        setIsSubmitting(false);
    };

    const handleClose = () => {
        setOpen(false);
        
        setTimeout(() => {
            setSubmitted(false);
            setFormData({ name: "", phone: "", ward: "", type: "", location: "", description: "" });
        }, 300);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    className="fixed bottom-6 right-6 z-[999] h-11 px-5 rounded-full gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg shadow-orange-500/20 transition-all duration-300 hover:-translate-y-1"
                >
                    <MessageSquarePlus className="w-5 h-5" />
                    <span className="font-medium text-sm tracking-wide hidden md:inline">Report Issue</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] z-[2000]">
                {!submitted ? (
                    <>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-orange-500" />
                                Report Pollution Issue
                            </DialogTitle>
                            <DialogDescription>
                                Help us identify pollution hotspots. Your complaint will be addressed within 24 hours.
                            </DialogDescription>
                        </DialogHeader>

                        {}
                        <div className="space-y-4 mt-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Your Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="Enter your name"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input
                                        id="phone"
                                        placeholder="10-digit number"
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Ward / Area</Label>
                                    <Select
                                        value={formData.ward}
                                        onValueChange={value => setFormData({ ...formData, ward: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select ward" />
                                        </SelectTrigger>
                                        <SelectContent className="z-[2002]">
                                            {wards.map((ward: any) => (
                                                <SelectItem key={ward.id} value={ward.id}>
                                                    {ward.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Complaint Type</Label>
                                    <Select
                                        value={formData.type}
                                        onValueChange={value => setFormData({ ...formData, type: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent className="z-[2002]">
                                            {complaintTypes.map(type => (
                                                <SelectItem key={type.value} value={type.value}>
                                                    <span className="flex items-center gap-2">
                                                        <span>{type.icon}</span>
                                                        <span>{type.label}</span>
                                                    </span>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="location" className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    Exact Location / Landmark
                                </Label>
                                <Input
                                    id="location"
                                    placeholder="e.g., Near Gandhi Park, Main Road"
                                    value={formData.location}
                                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Describe the pollution issue in detail..."
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
                                />
                            </div>

                            <DialogFooter className="mt-6 z-[2005] relative">
                                <Button variant="outline" onClick={() => setOpen(false)}>
                                    Cancel
                                </Button>
                                <Button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleSubmit(e);
                                    }}
                                    disabled={isSubmitting}
                                    className="gap-2 z-[2010] relative hover:scale-105 transition-transform"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            <MessageSquarePlus className="w-4 h-4" />
                                            Submit Complaint
                                        </>
                                    )}
                                </Button>
                            </DialogFooter>
                        </div>
                    </>
                ) : (
                    <div className="py-8 text-center space-y-4">
                        <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 flex items-center justify-center">
                            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-emerald-700">Complaint Registered!</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                Your complaint has been successfully submitted.
                            </p>
                        </div>
                        <div className="bg-muted p-4 rounded-lg">
                            <p className="text-xs text-muted-foreground">Ticket Number</p>
                            <p className="text-2xl font-bold font-mono text-primary">{ticketId}</p>
                            <p className="text-xs text-muted-foreground mt-2">
                                Save this number to track your complaint status
                            </p>
                        </div>
                        <div className="text-sm text-muted-foreground">
                            <p>📱 You will receive updates via SMS</p>
                            <p>⏱️ Expected response within 24 hours</p>
                        </div>
                        <Button onClick={handleClose} className="mt-4">
                            Done
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
