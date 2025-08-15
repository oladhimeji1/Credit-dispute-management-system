'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { useAuth } from '@/lib/contexts/auth-context';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { Bot, FileText, Copy, Download } from 'lucide-react';

const generateLetterSchema = z.object({
  itemName: z.string().min(1, 'Item name is required'),
  itemType: z.string().min(1, 'Item type is required'),
  reason: z.string().min(1, 'Reason is required'),
  additionalContext: z.string().optional(),
});

export default function AiPage() {
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState('');

  const form = useForm<z.infer<typeof generateLetterSchema>>({
    resolver: zodResolver(generateLetterSchema),
    defaultValues: {
      itemName: '',
      itemType: '',
      reason: '',
      additionalContext: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof generateLetterSchema>) => {
    setIsGenerating(true);
    try {
      const response = await api.post('/ai/generate-letter', {
        ...values,
        userDetails: {
          firstName: user?.firstName,
          lastName: user?.lastName,
        },
      });
      
      setGeneratedLetter(response.data.letter);
      toast.success('Dispute letter generated successfully!');
    } catch (error) {
      console.error('Error generating letter:', error);
      toast.error('Failed to generate dispute letter');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLetter);
    toast.success('Letter copied to clipboard!');
  };

  const downloadLetter = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedLetter], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'dispute-letter.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Letter downloaded!');
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Bot className="h-8 w-8 mr-3 text-blue-600" />
            AI Dispute Letter Generator
          </h1>
          <p className="text-gray-600 mt-2">
            Generate professional dispute letters using AI assistance. Our system creates personalized letters based on your specific situation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Dispute Details
              </CardTitle>
              <CardDescription>
                Provide information about the item you want to dispute
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                    name="additionalContext"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Context (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Provide any additional details about the dispute..."
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={isGenerating}>
                    {isGenerating ? (
                      <>
                        <Bot className="h-4 w-4 mr-2 animate-spin" />
                        Generating Letter...
                      </>
                    ) : (
                      <>
                        <Bot className="h-4 w-4 mr-2" />
                        Generate Dispute Letter
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Generated Letter */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Generated Letter
                </span>
                {generatedLetter && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={copyToClipboard}>
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm" onClick={downloadLetter}>
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                )}
              </CardTitle>
              <CardDescription>
                Your AI-generated dispute letter will appear here
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isGenerating ? (
                <div className="space-y-4">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>
                  <div className="text-center text-sm text-gray-600">
                    <Bot className="h-8 w-8 mx-auto mb-2 animate-spin text-blue-600" />
                    Generating your personalized dispute letter...
                  </div>
                </div>
              ) : generatedLetter ? (
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4 border">
                    <pre className="whitespace-pre-wrap text-sm font-mono leading-relaxed">
                      {generatedLetter}
                    </pre>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      <strong>Important:</strong> Please review this letter carefully and modify it as needed before sending it to the credit bureaus. Make sure all information is accurate and relevant to your specific situation.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">No letter generated yet</p>
                  <p className="text-sm">Fill out the form and click "Generate Dispute Letter" to create your personalized letter.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tips and Guidelines */}
        <Card>
          <CardHeader>
            <CardTitle>Tips for Effective Dispute Letters</CardTitle>
            <CardDescription>
              Best practices for writing successful dispute letters
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Do's</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Be specific about the information you're disputing</li>
                  <li>• Include supporting documentation when possible</li>
                  <li>• Keep a copy of your letter and all correspondence</li>
                  <li>• Send letters via certified mail with return receipt requested</li>
                  <li>• Be professional and factual in your language</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Don'ts</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Don't use emotional or threatening language</li>
                  <li>• Don't dispute multiple items in a single letter</li>
                  <li>• Don't include unnecessary personal information</li>
                  <li>• Don't expect immediate results (allow 30-45 days)</li>
                  <li>• Don't give up after the first response</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}