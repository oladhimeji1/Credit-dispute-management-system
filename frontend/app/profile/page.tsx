'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { useAuth } from '@/lib/contexts/auth-context';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { CreditCard, Calendar, TrendingUp, AlertTriangle, Plus } from 'lucide-react';
import Link from 'next/link';
import { CreateDisputeDialog } from '@/components/disputes/create-dispute-dialog';

interface CreditProfile {
  id: string;
  creditScore: number;
  reportDate: string;
  openAccounts: Account[];
  creditHistory: HistoryItem[];
  inquiries: Inquiry[];
}

interface Account {
  accountName: string;
  accountType: string;
  balance: number;
  creditLimit?: number;
  paymentHistory: string;
  accountAge: string;
}

interface HistoryItem {
  date: string;
  action: string;
  details: string;
}

interface Inquiry {
  date: string;
  creditor: string;
  type: string;
  purpose: string;
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<CreditProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<Account | null>(null);
  const [showDisputeDialog, setShowDisputeDialog] = useState(false);

  useEffect(() => {
    if (user) {
      loadCreditProfile();
    }
  }, [user]);

  const loadCreditProfile = async () => {
    if (!user) return;
    
    try {
      const response = await api.get(`/credit-profile/${user.id}`);
      setProfile(response.data);
    } catch (error) {
      console.error('Error loading credit profile:', error);
      toast.error('Failed to load credit profile');
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 750) return 'text-green-600';
    if (score >= 700) return 'text-blue-600';
    if (score >= 650) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreDescription = (score: number) => {
    if (score >= 750) return 'Excellent';
    if (score >= 700) return 'Good';
    if (score >= 650) return 'Fair';
    return 'Poor';
  };

  const handleDisputeItem = (account: Account) => {
    setSelectedItem(account);
    setShowDisputeDialog(true);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!profile) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <CreditCard className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold mb-2">No Credit Profile Found</h3>
          <p className="text-gray-600 mb-4">We couldn't load your credit profile at this time.</p>
          <Button onClick={loadCreditProfile}>Try Again</Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Credit Profile</h1>
            <p className="text-gray-600 mt-1">
              Last updated: {new Date(profile.reportDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Credit Score Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Credit Score
              </CardTitle>
              <CardDescription>Your current credit rating</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className={`text-6xl font-bold mb-4 ${getScoreColor(profile.creditScore)}`}>
                {profile.creditScore}
              </div>
              <div className="mb-4">
                <Badge variant="secondary" className="text-sm">
                  {getScoreDescription(profile.creditScore)}
                </Badge>
              </div>
              <Progress value={(profile.creditScore / 850) * 100} className="h-3 mb-2" />
              <p className="text-sm text-gray-600">Out of 850</p>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Open Accounts
                </span>
                <Badge variant="outline">{profile.openAccounts.length} accounts</Badge>
              </CardTitle>
              <CardDescription>Your active credit accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {profile.openAccounts.map((account, index) => (
                  <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{account.accountName}</h4>
                        <p className="text-sm text-gray-600">{account.accountType}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDisputeItem(account)}
                      >
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        Dispute
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Balance</p>
                        <p className="font-medium">${account.balance.toLocaleString()}</p>
                      </div>
                      {account.creditLimit && (
                        <div>
                          <p className="text-gray-600">Credit Limit</p>
                          <p className="font-medium">${account.creditLimit.toLocaleString()}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-gray-600">Payment History</p>
                        <Badge 
                          variant={account.paymentHistory.includes('Current') ? 'default' : 'destructive'}
                          className="text-xs"
                        >
                          {account.paymentHistory}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-gray-600">Account Age</p>
                        <p className="font-medium">{account.accountAge}</p>
                      </div>
                    </div>

                    {account.creditLimit && (
                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>Utilization</span>
                          <span>{Math.round((account.balance / account.creditLimit) * 100)}%</span>
                        </div>
                        <Progress 
                          value={(account.balance / account.creditLimit) * 100} 
                          className="h-2"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Credit History and Inquiries */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Recent Credit History
              </CardTitle>
              <CardDescription>Recent changes to your credit profile</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {profile.creditHistory.map((item, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{item.action}</p>
                      <p className="text-sm text-gray-600">{item.details}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(item.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Credit Inquiries</CardTitle>
              <CardDescription>Recent credit checks on your profile</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {profile.inquiries.map((inquiry, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900">{inquiry.creditor}</h4>
                      <Badge 
                        variant={inquiry.type === 'Hard Inquiry' ? 'destructive' : 'secondary'}
                        className="text-xs"
                      >
                        {inquiry.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{inquiry.purpose}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(inquiry.date).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks for managing your credit</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/disputes">
                  <Plus className="h-4 w-4 mr-2" />
                  File New Dispute
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/ai">
                  Generate Dispute Letter
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/disputes">
                  View Dispute History
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Create Dispute Dialog */}
        <CreateDisputeDialog
          open={showDisputeDialog}
          onOpenChange={setShowDisputeDialog}
          selectedItem={selectedItem}
          onSuccess={() => {
            setShowDisputeDialog(false);
            toast.success('Dispute created successfully!');
          }}
        />
      </div>
    </DashboardLayout>
  );
}