'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useKaffeiners } from '@/hooks/use-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShimmerCard } from '@/components/ui/shimmer';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Coffee, Globe, Database, PlusCircle, Trash2, ExternalLink, Clock } from 'lucide-react';
import Link from 'next/link';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function KaffeinersPage() {
  const { kaffeiners, loading, mutate } = useKaffeiners();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState('');

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setDeleteError('');
      const response = await fetch(`/api/kaffeiners?id=${deleteId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to delete');
      await mutate();
      setDeleteId(null);
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Error deleting kaffeiner');
    }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 w-48 bg-muted rounded animate-pulse" />
            <div className="h-4 w-32 bg-muted rounded animate-pulse mt-2" />
          </div>
          <div className="h-10 w-40 bg-muted rounded animate-pulse" />
        </div>
        {[1, 2, 3].map((i) => (
          <ShimmerCard key={i} />
        ))}
      </div>
    );
  }

  const getTypeIcon = (type: string, dbType?: string) => {
    if (type === 'website') return <Globe size={18} className="text-blue-500" />;
    if (dbType === 'mongodb') return <Database size={18} className="text-green-500" />;
    return <Database size={18} className="text-purple-500" />;
  };

  const getTypeLabel = (k: any) => {
    if (k.type === 'website') return 'Website';
    return k.db_type?.toUpperCase() || 'Database';
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="p-4 md:p-8 space-y-6"
    >
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Kaffeiners</h1>
          <p className="text-muted-foreground text-sm">Manage your monitored services</p>
        </div>
        <Link href="/dashboard/kaffeiner">
          <Button className="gap-2 w-full sm:w-auto">
            <PlusCircle size={16} />
            New Kaffeiner
          </Button>
        </Link>
      </motion.div>

      {deleteError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-destructive/10 text-destructive p-3 rounded-md text-sm"
        >
          {deleteError}
        </motion.div>
      )}

      {kaffeiners.length === 0 ? (
        <motion.div variants={item}>
          <Card className="border-dashed">
            <CardContent className="pt-12 pb-12 text-center">
              <Coffee size={48} className="mx-auto text-muted-foreground/40 mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No kaffeiners yet</h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
                Create your first kaffeiner to start monitoring websites or databases.
                We&apos;ll check their health regularly and keep you informed.
              </p>
              <Link href="/dashboard/kaffeiner">
                <Button className="gap-2">
                  <PlusCircle size={16} />
                  Create First Kaffeiner
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <motion.div variants={item} className="space-y-3">
          {kaffeiners.map((k: any) => (
            <motion.div key={k._id} variants={item}>
              <Card className="group hover:border-primary/50 transition-all duration-200 hover:shadow-md">
                <CardContent className="py-4 px-6">
                  <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-lg bg-muted">
                      {getTypeIcon(k.type, k.db_type)}
                    </div>
                    <Link
                      href={`/dashboard/kaffeiners/${k._id}`}
                      className="flex-1 min-w-0"
                    >
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                          {k.title}
                        </h3>
                        <ExternalLink size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="inline-block bg-muted text-muted-foreground px-2 py-0.5 rounded text-xs font-medium">
                          {getTypeLabel(k)}
                        </span>
                        {k.type === 'database' && k.db_type && (
                          <span className="text-xs text-muted-foreground">•</span>
                        )}
                        {k.type === 'database' && k.collection_or_table && (
                          <span className="text-xs text-muted-foreground font-mono">
                            {k.collection_or_table}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock size={12} />
                          {k.recentKaffeiner
                            ? new Date(k.recentKaffeiner).toLocaleString()
                            : 'Never checked'}
                        </span>
                      </div>
                    </Link>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          k.active ? 'bg-green-500 shadow-sm shadow-green-500/50' : 'bg-red-500'
                        }`}
                        title={k.active ? 'Active' : 'Inactive'}
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => setDeleteId(k._id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Kaffeiner?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The kaffeiner and all its status history will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={handleDelete}>
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}
