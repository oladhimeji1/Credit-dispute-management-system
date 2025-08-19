'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { CreateDisputeDialog } from '@/components/disputes/create-dispute-dialog';
import { DisputeDetailsDialog } from '@/components/disputes/dispute-details-dialog';
import { useAuth } from '@/lib/contexts/auth-context';
import { useWebSocket } from '@/lib/contexts/websocket-context';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { Plus, Search, Filter, Eye, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface Dispute {
  id: string;
  itemName: string;
  itemType: string;
  reason: string;
  description?: string;
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

export default function DisputesPage() {
  const { user } = useAuth();
  const { socket, isConnected } = useWebSocket();
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [filteredDisputes, setFilteredDisputes] = useState<Dispute[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadDisputes();
  }, []);

  useEffect(() => {
    filterDisputes();
  }, [disputes, searchTerm, statusFilter]);

  useEffect(() => {
    if (!socket || !isConnected) return;

    // Listen for dispute creation
    socket.on('disputeCreated', (newDispute: Dispute) => {
      // console.log('New dispute created:', newDispute);
      setDisputes(prev => [newDispute, ...prev]);
      toast.success(`New dispute created: ${newDispute.itemName}`);
    });

    // Listen for dispute updates
    socket.on('disputeUpdated', (updatedDispute: Dispute) => {
      // console.log('Dispute updated:', updatedDispute);
      setDisputes(prev => prev.map(dispute => 
        dispute.id === updatedDispute.id ? updatedDispute : dispute
      ));
      
      // Update selected dispute if it's the one being updated
      if (selectedDispute && selectedDispute.id === updatedDispute.id) {
        setSelectedDispute(updatedDispute);
      }
      
      toast.success(`Dispute updated: ${updatedDispute.itemName}`);
    });

    // Listen for dispute deletion
    socket.on('disputeDeleted', (disputeId: string) => {
      // console.log('Dispute deleted:', disputeId);
      setDisputes(prev => prev.filter(dispute => dispute.id !== disputeId));
      toast.success('Dispute deleted successfully');
    });

    return () => {
      socket.off('disputeCreated');
      socket.off('disputeUpdated');
      socket.off('disputeDeleted');
    };
  }, [socket, isConnected, selectedDispute]);

  const loadDisputes = async () => {
    try {
      const response = await api.get('/disputes/history');
      setDisputes(response.data);
    } catch (error) {
      console.error('Error loading disputes:', error);
      toast.error('Failed to load disputes');
    } finally {
      setIsLoading(false);
    }
  };

  const filterDisputes = () => {
    let filtered = disputes;

    if (searchTerm) {
      filtered = filtered.filter(dispute =>
        dispute.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dispute.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (dispute.user && `${dispute.user.firstName} ${dispute.user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(dispute => dispute.status === statusFilter);
    }

    setFilteredDisputes(filtered);
  };

  const updateDisputeStatus = async (disputeId: string, status: string, adminNotes?: string) => {
    try {
      await api.put(`/disputes/${disputeId}/status`, { status, adminNotes });
      await loadDisputes();
      toast.success(`Dispute ${status} successfully`);
    } catch (error) {
      console.error('Error updating dispute status:', error);
      toast.error('Failed to update dispute status');
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

  const handleViewDetails = (dispute: Dispute) => {
    setSelectedDispute(dispute);
    setShowDetailsDialog(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {user?.role === 'admin' ? 'All Disputes' : 'My Disputes'}
            </h1>
            <p className="text-gray-600 mt-1">
              {user?.role === 'admin'
                ? 'Manage and review dispute submissions from all users'
                : 'Track and manage your credit dispute cases'
              }
            </p>
          </div>
          {user?.role === 'user' && (
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Dispute
            </Button>
          )}
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search disputes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="sm:w-48">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="submitted">Submitted</SelectItem>
                    <SelectItem value="under_review">Under Review</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Disputes List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="pt-6">
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredDisputes.length === 0 ? (
            <Card>
              <CardContent className="pt-12 pb-12 text-center">
                <div className="text-gray-400 mb-4">
                  <Plus className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {disputes.length === 0 ? 'No disputes found' : 'No matching disputes'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {disputes.length === 0
                    ? user?.role === 'user'
                      ? "You haven't created any disputes yet."
                      : "No disputes have been submitted yet."
                    : 'Try adjusting your search or filter criteria.'
                  }
                </p>
                {user?.role === 'user' && disputes.length === 0 && (
                  <Button onClick={() => setShowCreateDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Dispute
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredDisputes.map((dispute) => (
              <Card key={dispute.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{dispute.itemName}</CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-1">
                        <span>{dispute.itemType}</span>
                        {user?.role === 'admin' && dispute.user && (
                          <span>• {dispute.user.firstName} {dispute.user.lastName}</span>
                        )}
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {format(new Date(dispute.createdAt), 'MMM d, yyyy')}
                        </span>
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(dispute.status)}>
                        {formatStatus(dispute.status)}
                      </Badge>
                      <Button variant="outline" size="sm" onClick={() => handleViewDetails(dispute)}>
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-gray-600 mb-3">
                    <span className="font-medium">Reason:</span> {dispute.reason}
                  </p>
                  {dispute.description && (
                    <p className="text-sm text-gray-600 mb-3">
                      <span className="font-medium">Description:</span> {dispute.description}
                    </p>
                  )}
                  
                  {user?.role === 'admin' && (dispute.status === 'pending' || dispute.status === 'submitted') && (
                    <div className="flex gap-2 mt-4">
                      <Button
                        size="sm"
                        onClick={() => updateDisputeStatus(dispute.id, 'under_review')}
                      >
                        Mark Under Review
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateDisputeStatus(dispute.id, 'resolved')}
                      >
                        Resolve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateDisputeStatus(dispute.id, 'rejected')}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Create Dispute Dialog */}
        <CreateDisputeDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
          onSuccess={() => {
            setShowCreateDialog(false);
            loadDisputes();
            toast.success('Dispute created successfully!');
          }}
        />

        {/* Dispute Details Dialog */}
        <DisputeDetailsDialog
          open={showDetailsDialog}
          onOpenChange={setShowDetailsDialog}
          dispute={selectedDispute}
          onStatusUpdate={updateDisputeStatus}
          isAdmin={user?.role === 'admin'}
        />
      </div>
    </DashboardLayout>
  );
}