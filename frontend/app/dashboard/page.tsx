'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/lib/contexts/auth-context';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { CreditCard, FileText, TrendingUp, AlertCircle, Plus, Eye } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface DashboardStats {
  totalDisputes: number;
  pendingDisputes: number;
  resolvedDisputes: number;
  creditScore?: number;
}

interface RecentDispute {
  id: string;
  itemName: string;
  status: string;
  createdAt: string;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalDisputes: 0,
    pendingDisputes: 0,
    resolvedDisputes: 0,
  });
  const [recentDisputes, setRecentDisputes] = useState<RecentDispute[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [disputesResponse, profileResponse] = await Promise.all([
        api.get('/disputes/history'),
        user?.role === 'user' ? api.get(`/credit-profile/${user.id}`) : Promise.resolve(null)
      ]);

      const disputes = disputesResponse.data;
      
      setStats({
        totalDisputes: disputes.length,
        pendingDisputes: disputes.filter((d: any) => d.status === 'pending' || d.status === 'submitted').length,
        resolvedDisputes: disputes.filter((d: any) => d.status === 'resolved').length,
        creditScore: profileResponse?.data?.creditScore,
      });

      setRecentDisputes(disputes.slice(0, 5));
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'under_review': return 'bg-purple-100 text-purple-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatus = (status: string) => {
    return status.replace('_', ' ').toUpperCase();
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.firstName}!
            </h1>
            <p className="text-gray-600 mt-1">
              {user?.role === 'admin' 
                ? 'Manage disputes and monitor system activity' 
                : 'Monitor your credit profile and manage disputes'
              }
            </p>
          </div>
          <div className="flex gap-2">
            {user?.role === 'user' && (
              <>
                <Button asChild>
                  <Link href="/profile">
                    <Eye className="h-4 w-4 mr-2" />
                    View Profile
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/disputes">
                    <Plus className="h-4 w-4 mr-2" />
                    New Dispute
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {user?.role === 'user' && stats.creditScore && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Credit Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stats.creditScore}</div>
                <div className="mt-2">
                  <Progress value={(stats.creditScore / 850) * 100} className="h-2" />
                </div>
                <p className="text-xs text-gray-600 mt-1">Out of 850</p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Total Disputes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.totalDisputes}</div>
              <p className="text-xs text-gray-600 mt-1">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-2" />
                Pending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.pendingDisputes}</div>
              <p className="text-xs text-gray-600 mt-1">Awaiting review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" />
                Resolved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.resolvedDisputes}</div>
              <p className="text-xs text-gray-600 mt-1">Successfully completed</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Recent Disputes
                <Button variant="outline" size="sm" asChild>
                  <Link href="/disputes">View All</Link>
                </Button>
              </CardTitle>
              <CardDescription>
                {user?.role === 'admin' 
                  ? 'Latest dispute submissions across all users'
                  : 'Your most recent dispute activities'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : recentDisputes.length > 0 ? (
                <div className="space-y-4">
                  {recentDisputes.map((dispute) => (
                    <div key={dispute.id} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{dispute.itemName}</p>
                        <p className="text-xs text-gray-600">
                          {new Date(dispute.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge className={getStatusColor(dispute.status)}>
                        {formatStatus(dispute.status)}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No disputes found</p>
                  {user?.role === 'user' && (
                    <Button variant="outline" size="sm" className="mt-2" asChild>
                      <Link href="/disputes">Create Your First Dispute</Link>
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common tasks and helpful resources
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {user?.role === 'user' ? (
                <>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/profile">
                      <CreditCard className="h-4 w-4 mr-2" />
                      View Credit Profile
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/disputes">
                      <Plus className="h-4 w-4 mr-2" />
                      File New Dispute
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/ai">
                      <FileText className="h-4 w-4 mr-2" />
                      Generate Dispute Letter
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/disputes">
                      <FileText className="h-4 w-4 mr-2" />
                      Review Pending Disputes
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/users">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Manage Users
                    </Link>
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}