"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { disputesAPI } from "@/lib/api";

interface UpdateDisputeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dispute: any;
  onSuccess: () => void;
}

export function UpdateDisputeDialog({
  open,
  onOpenChange,
  dispute,
  onSuccess,
}: UpdateDisputeDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    creditorName: dispute?.creditorName || "",
    accountNumber: dispute?.accountNumber || "",
    disputeType: dispute?.disputeType || "INACCURATE",
    reason: dispute?.reason || "",
    desiredOutcome: dispute?.desiredOutcome || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await disputesAPI.update(dispute.id, formData);
      toast({
        title: "Success",
        description: "Dispute updated successfully!",
      });
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update dispute",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Update Dispute</DialogTitle>
          <DialogDescription>
            Update the details of your dispute. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="creditorName">Creditor Name</Label>
              <Input
                id="creditorName"
                value={formData.creditorName}
                onChange={(e) =>
                  setFormData({ ...formData, creditorName: e.target.value })
                }
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                value={formData.accountNumber}
                onChange={(e) =>
                  setFormData({ ...formData, accountNumber: e.target.value })
                }
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="disputeType">Dispute Type</Label>
              <Select
                value={formData.disputeType}
                onValueChange={(value) =>
                  setFormData({ ...formData, disputeType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select dispute type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INACCURATE">Inaccurate Information</SelectItem>
                  <SelectItem value="FRAUDULENT">Fraudulent Account</SelectItem>
                  <SelectItem value="OUTDATED">Outdated Information</SelectItem>
                  <SelectItem value="INCOMPLETE">Incomplete Information</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="reason">Reason for Dispute</Label>
              <Textarea
                id="reason"
                value={formData.reason}
                onChange={(e) =>
                  setFormData({ ...formData, reason: e.target.value })
                }
                rows={4}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="desiredOutcome">Desired Outcome</Label>
              <Textarea
                id="desiredOutcome"
                value={formData.desiredOutcome}
                onChange={(e) =>
                  setFormData({ ...formData, desiredOutcome: e.target.value })
                }
                rows={3}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
