'use client';

import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { useKaffeiners } from '@/hooks/use-data';
import { useRealtime } from '@/hooks/use-realtime';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
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
import {
  Coffee, Globe, Database, PlusCircle, Trash2, ExternalLink, Clock,
  Wifi, Search, X, Filter,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0 },
};

const filterTabs = [
  { id: 'all', label: 'All' },
  { id: 'website', label: 'Websites' },
  { id: 'database', label: 'Databases' },
];

export default function KaffeinersPage() {
  const { kaffeiners, loading, mutate } = useKaffeiners();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState('');
  const [isLive, setIsLive] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useRealtime({
    onEvent: (event) => {
      if (event.type === 'connected') {
        setIsLive(true);
      }
    },
  });

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

  const filteredKaffeiners = useMemo(() => {
    if (!kaffeiners) return [];
    return kaffeiners.filter((k: any) => {
      const matchSearch = !search || k.title.toLowerCase().includes(search.toLowerCase());
      const matchFilter = filter === 'all' || k.type === filter;
      return matchSearch && matchFilter;
    });
  }, [kaffeiners, search, filter]);

  const stats = useMemo(() => {
    if (!kaffeiners) return { total: 0, active: 0, websites: 0, databases: 0 };
    return {
      total: kaffeiners.length,
      active: kaffeiners.filter((k: any) => k.active).length,
      websites: kaffeiners.filter((k: any) => k.type === 'website').length,
      databases: kaffeiners.filter((k: any) => k.type === 'database').length,
    };
  }, [kaffeiners]);

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

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="p-4 md:p-8 space-y-6"
    >
      {/* Header */}
      <motion.div variants={item} className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-primary/[0.04] via-card to-card p-5 md:p-6">
        <div className="absolute inset-0 bg-grid-black dark:bg-grid-white opacity-[0.015]" />
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-xl bg-primary/10 flex items-center justify-center ring-1 ring-primary/20">
              <Coffee size={20} className="text-primary" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-foreground tracking-tight">Kaffeiners</h1>
              <p className="text-xs text-muted-foreground/70">Manage your monitored services</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isLive && (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success/10 border border-success/20 text-[10px] font-semibold text-success">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                </span>
                LIVE
              </span>
            )}
            <Link href="/dashboard/kaffeiner">
              <Button className="gap-2 w-full sm:w-auto">
                <PlusCircle size={16} />
                New Kaffeiner
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Stats strip */}
      <motion.div variants={item} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total', value: stats.total, color: 'text-foreground' },
          { label: 'Active', value: stats.active, color: 'text-success' },
          { label: 'Websites', value: stats.websites, color: 'text-primary' },
          { label: 'Databases', value: stats.databases, color: 'text-secondary' },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border/40 bg-card p-3 text-center">
            <p className="text-[10px] text-muted-foreground/60 font-medium uppercase tracking-wider">{s.label}</p>
            <p className={`text-lg font-bold ${s.color} mt-0.5`}>{s.value}</p>
          </div>
        ))}
      </motion.div>

      {/* Filter + Search bar */}
      <motion.div variants={item} className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-1 p-1 rounded-lg bg-muted/40 border border-border/30 w-fit">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={cn(
                'px-3 py-1.5 rounded-md text-xs font-medium transition-all',
                filter === tab.id
                  ? 'bg-card text-foreground shadow-xs border border-border/40'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/50 pointer-events-none" />
          <Input
            placeholder="Search kaffeiners..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 pl-8 pr-8 text-xs"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-muted-foreground transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </motion.div>

      {deleteError && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-destructive/10 border border-destructive/20 text-destructive p-3 rounded-lg text-sm"
        >
          {deleteError}
        </motion.div>
      )}

      {filteredKaffeiners.length === 0 ? (
        <motion.div variants={item}>
          {kaffeiners.length === 0 ? (
            <Card className="border-dashed border-2 border-border/40">
              <CardContent className="pt-14 pb-14 text-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                >
                  <div className="size-16 rounded-2xl bg-muted/30 flex items-center justify-center mx-auto">
                    <Coffee size={32} className="text-muted-foreground/30" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mt-4">No kaffeiners yet</h3>
                  <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
                    Create your first kaffeiner to start monitoring websites or databases.
                    We&apos;ll check their health regularly and keep you informed.
                  </p>
                  <Link href="/dashboard/kaffeiner">
                    <Button className="gap-2 mt-6">
                      <PlusCircle size={16} />
                      Create First Kaffeiner
                    </Button>
                  </Link>
                </motion.div>
              </CardContent>
            </Card>
          ) : (
            <div className="text-center py-12">
              <div className="size-12 rounded-xl bg-muted/20 flex items-center justify-center mx-auto">
                <Search size={20} className="text-muted-foreground/40" />
              </div>
              <p className="text-sm text-muted-foreground mt-3">No kaffeiners match your search</p>
              <button
                onClick={() => { setSearch(''); setFilter('all'); }}
                className="text-xs text-primary hover:underline mt-1"
              >
                Clear filters
              </button>
            </div>
          )}
        </motion.div>
      ) : (
        <motion.div variants={item} className="space-y-2">
          {filteredKaffeiners.map((k: any, i: number) => (
            <motion.div
              key={k._id}
              variants={item}
              custom={i}
            >
              <div className="group relative rounded-xl border border-border/50 bg-card hover:border-primary/30 hover:shadow-md transition-all duration-300 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative p-4 sm:p-5">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className={`hidden sm:flex items-center justify-center size-11 rounded-xl shrink-0 transition-colors ${
                      k.type === 'website' ? 'bg-primary/10' : k.db_type === 'mongodb' ? 'bg-success/10' : 'bg-secondary/10'
                    }`}>
                      {k.type === 'website' ? (
                        <Globe size={18} className="text-primary" />
                      ) : k.db_type === 'mongodb' ? (
                        <Database size={18} className="text-success" />
                      ) : (
                        <Database size={18} className="text-secondary" />
                      )}
                    </div>

                    <Link
                      href={`/dashboard/kaffeiners/${k._id}`}
                      className="flex-1 min-w-0"
                    >
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm sm:text-base text-foreground truncate group-hover:text-primary transition-colors">
                          {k.title}
                        </h3>
                        <ExternalLink size={13} className="text-muted-foreground/30 group-hover:text-primary/60 transition-all shrink-0 opacity-0 group-hover:opacity-100" />
                      </div>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className={cn(
                          'inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium',
                          k.type === 'website'
                            ? 'bg-primary/8 text-primary'
                            : 'bg-secondary/8 text-secondary'
                        )}>
                          {k.type === 'website' ? 'Website' : k.db_type?.toUpperCase() || 'Database'}
                        </span>
                        {k.type === 'database' && k.collection_or_table && (
                          <>
                            <span className="text-[10px] text-muted-foreground/40">/</span>
                            <span className="text-[10px] text-muted-foreground/60 font-mono truncate max-w-[120px]">
                              {k.collection_or_table}
                            </span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3 mt-1.5">
                        <span className="flex items-center gap-1 text-[10px] sm:text-xs text-muted-foreground/60">
                          <Clock size={10} />
                          <span className="truncate max-w-[120px] sm:max-w-none">
                            {k.recentKaffeiner
                              ? new Date(k.recentKaffeiner).toLocaleString()
                              : 'Never checked'}
                          </span>
                        </span>
                      </div>
                    </Link>

                    <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                      <div className="flex items-center gap-1.5">
                        <span className="relative flex h-2.5 w-2.5">
                          {k.active && (
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                          )}
                          <span
                            className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                              k.active ? 'bg-green-500 shadow-sm shadow-green-500/30' : 'bg-red-500'
                            }`}
                          />
                        </span>
                        <span className="text-[10px] sm:text-xs text-muted-foreground/70 hidden sm:inline font-medium">
                          {k.active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10 h-8 w-8 sm:h-9 sm:w-9"
                        onClick={() => setDeleteId(k._id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
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
