
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface HelenaStatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  loading?: boolean;
  variant?: 'pending' | 'approved' | 'rejected' | 'confidence';
}

export function HelenaStatsCard({ 
  title, 
  value, 
  icon, 
  loading = false,
  variant = 'pending'
}: HelenaStatsCardProps) {
  const variantStyles = {
    pending: 'bg-purple-50 border-purple-200 text-purple-800',
    approved: 'bg-green-50 border-green-200 text-green-800',
    rejected: 'bg-red-50 border-red-200 text-red-800',
    confidence: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-6 w-12" />
            </div>
            <Skeleton className="h-5 w-5 rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('transition-colors', variantStyles[variant])}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium opacity-80">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
          <div className="opacity-60">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
