'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { Calendar, User, FileText, MessageSquare } from 'lucide-react';

interface Dispute {
  id: string;
  itemName: string;
  itemType: string;
  reason: string;
  description?: string;
  supportingDocuments?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  adminNotes?: string;
}

interface DisputeDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dispute: Dispute | null;
  onStatusUpdate?: (disputeId: string, status: string, adminNotes?: string) => Promise<void>;
  isAdmin?: boolean;
}

const statusUpdateSchema = z.object({
  status: z.string().min(1, 'Status is required'),
  adminNotes: z.string().optional(),
});

export function DisputeDetailsDialog({
  open,
  onOpenChange,
  dispute,
  onStatusUpdate,
  isAdmin = false,
}: DisputeDetailsDialogProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const form = useForm<z.infer<typeof statusUpdateSchema>>({
    resolver: zodResolver(statusUpdateSchema),
    defaultValues: {
      status: dispute?.status || '',
      adminNotes: dispute?.adminNotes || '',
    },
  });

  const onSubmit = async (values: z.infer<typeof statusUpdateSchema>) => {
    if (!dispute || !onStatusUpdate) return;
    
    setIsUpdating(true);
    try {
      await onStatusUpdate(dispute.id, values.status, values.adminNotes);
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating dispute:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'submitted': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'under_review': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatStatus = (status: string) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (!dispute) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Dispute Details</span>
            <Badge className={getStatusColor(dispute.status)}>
              {formatStatus(dispute.status)}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Detailed information about this dispute case
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Item Name</label>
                <p className="text-sm text-gray-900 mt-1">{dispute.itemName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Item Type</label>
                <p className="text-sm text-gray-900 mt-1">{dispute.itemType}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Dispute Reason</label>
                <p className="text-sm text-gray-900 mt-1">{dispute.reason}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Created</label>
                <p className="text-sm text-gray-900 mt-1 flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {format(new Date(dispute.createdAt), 'MMM d, yyyy h:mm a')}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* User Information (for admins) */}
          {isAdmin && dispute.user && (
            <>
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  User Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Name</label>
                    <p className="text-sm text-gray-900 mt-1">
                      {dispute.user.firstName} {dispute.user.lastName}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <p className="text-sm text-gray-900 mt-1">{dispute.user.email}</p>
                  </div>
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Dispute Details */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Dispute Details
            </h3>
            <div className="space-y-4">
              {dispute.description && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Description</label>
                  <p className="text-sm text-gray-900 mt-1 bg-gray-50 p-3 rounded-lg">
                    {dispute.description}
                  </p>
                </div>
              )}
              {dispute.supportingDocuments && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Supporting Documents</label>
                  <p className="text-sm text-gray-900 mt-1 bg-gray-50 p-3 rounded-lg">
                    {dispute.supportingDocuments}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Admin Notes */}
          {(dispute.adminNotes || isAdmin) && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Admin Notes
                </h3>
                {dispute.adminNotes && !isAdmin ? (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-900">{dispute.adminNotes}</p>
                  </div>
                ) : null}
              </div>
            </>
          )}

          {/* Admin Status Update Form */}
          {isAdmin && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Update Status</h3>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="submitted">Submitted</SelectItem>
                              <SelectItem value="under_review">Under Review</SelectItem>
                              <SelectItem value="resolved">Resolved</SelectItem>
                              <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="adminNotes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Admin Notes</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Add notes about this dispute..."
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => onOpenChange(false)}
                      disabled={isUpdating}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isUpdating}>
                      {isUpdating ? 'Updating...' : 'Update Dispute'}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}