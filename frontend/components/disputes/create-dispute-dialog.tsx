'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { api } from '@/lib/api';
import { toast } from 'sonner';

const createDisputeSchema = z.object({
  itemName: z.string().min(1, 'Item name is required'),
  itemType: z.string().min(1, 'Item type is required'),
  reason: z.string().min(1, 'Reason is required'),
  description: z.string().optional(),
  supportingDocuments: z.string().optional(),
});

interface CreateDisputeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedItem?: any;
  onSuccess?: () => void;
}

export function CreateDisputeDialog({
  open,
  onOpenChange,
  selectedItem,
  onSuccess,
}: CreateDisputeDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof createDisputeSchema>>({
    resolver: zodResolver(createDisputeSchema),
    defaultValues: {
      itemName: selectedItem?.accountName || '',
      itemType: selectedItem?.accountType || '',
      reason: '',
      description: '',
      supportingDocuments: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof createDisputeSchema>) => {
    setIsSubmitting(true);
    try {
      await api.post('/disputes/create', values);
      toast.success('Dispute created successfully!');
      form.reset();
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create dispute');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create New Dispute</DialogTitle>
          <DialogDescription>
            File a dispute for an item on your credit report that you believe is inaccurate.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="itemName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Item Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Chase Freedom Credit Card"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="itemType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Item Type</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select item type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Credit Card">Credit Card</SelectItem>
                        <SelectItem value="Auto Loan">Auto Loan</SelectItem>
                        <SelectItem value="Mortgage">Mortgage</SelectItem>
                        <SelectItem value="Personal Loan">Personal Loan</SelectItem>
                        <SelectItem value="Collection Account">Collection Account</SelectItem>
                        <SelectItem value="Public Record">Public Record</SelectItem>
                        <SelectItem value="Credit Inquiry">Credit Inquiry</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dispute Reason</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select dispute reason" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Identity Theft">Identity Theft</SelectItem>
                        <SelectItem value="Not My Account">Not My Account</SelectItem>
                        <SelectItem value="Paid in Full">Paid in Full</SelectItem>
                        <SelectItem value="Incorrect Balance">Incorrect Balance</SelectItem>
                        <SelectItem value="Incorrect Payment History">Incorrect Payment History</SelectItem>
                        <SelectItem value="Account Closed by Consumer">Account Closed by Consumer</SelectItem>
                        <SelectItem value="Unauthorized Inquiry">Unauthorized Inquiry</SelectItem>
                        <SelectItem value="Outdated Information">Outdated Information</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Provide any additional details about why you're disputing this item..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="supportingDocuments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Supporting Documents (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="List any documents you have to support your dispute (e.g., payment receipts, bank statements)..."
                      rows={2}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Dispute'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}