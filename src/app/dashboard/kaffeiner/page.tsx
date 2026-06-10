'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Globe, Database, ArrowLeft, Coffee, Check, ChevronRight,
  Link as LinkIcon, Terminal, Server, Shield,
} from 'lucide-react';
import Link from 'next/link';
import { useKaffeiners } from '@/hooks/use-data';

const typeOptions = [
  {
    id: 'website' as const,
    icon: Globe,
    title: 'Website',
    description: 'Monitor website uptime by sending periodic HTTP requests.',
    features: ['HTTP/HTTPS support', 'SSL certificate check', 'Response time tracking'],
    gradient: 'from-primary/20 via-primary/5 to-transparent',
    iconBg: 'bg-primary/10',
    accent: 'border-primary/30 group-hover:border-primary',
  },
  {
    id: 'database' as const,
    icon: Database,
    title: 'Database',
    description: 'Monitor database connectivity for MongoDB, PostgreSQL, MySQL, and more.',
    features: ['MongoDB, SQL support', 'Connection pooling test', 'Query health checks'],
    gradient: 'from-secondary/20 via-secondary/5 to-transparent',
    iconBg: 'bg-secondary/10',
    accent: 'border-secondary/30 group-hover:border-secondary',
  },
];

const steps = [
  { id: 'type', label: 'Type' },
  { id: 'details', label: 'Details' },
  { id: 'review', label: 'Review' },
];

export default function CreateKaffeinerPage() {
  const router = useRouter();
  const { mutate } = useKaffeiners();
  const [step, setStep] = useState<'type' | 'details' | 'review'>('type');
  const [type, setType] = useState<'website' | 'database' | null>(null);
  const [dbType, setDbType] = useState<'sql' | 'mongodb' | null>(null);
  const [title, setTitle] = useState('');
  const [uri, setUri] = useState('');
  const [collectionOrTable, setCollectionOrTable] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleTypeSelect = (selected: 'website' | 'database') => {
    setType(selected);
    setStep('details');
  };

  const handleBack = () => {
    if (step === 'details') {
      setStep('type');
      setType(null);
      setDbType(null);
    } else if (step === 'review') {
      setStep('details');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const body: Record<string, string> = { title, type: type! };
      if (type === 'database') {
        body.db_type = dbType!;
        body.collection_or_table = collectionOrTable;
      }
      body.uri = uri;

      const response = await fetch('/api/kaffeiners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        credentials: 'include',
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to create kaffeiner');
      }

      await mutate();
      router.push('/dashboard/kaffeiners');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating kaffeiner');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-primary/[0.04] via-card to-card p-5 md:p-6"
      >
        <div className="absolute inset-0 bg-grid-black dark:bg-grid-white opacity-[0.015]" />
        <div className="relative flex items-center gap-4">
          <Link
            href="/dashboard/kaffeiners"
            className="size-8 rounded-lg bg-muted/30 flex items-center justify-center hover:bg-muted/50 transition-colors shrink-0"
          >
            <ArrowLeft size={16} className="text-muted-foreground" />
          </Link>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground tracking-tight">New Kaffeiner</h1>
            <p className="text-xs text-muted-foreground/70 mt-0.5">Add a service to monitor</p>
          </div>
        </div>
      </motion.div>

      {/* Step indicator */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-center gap-0 py-3"
      >
        {steps.map((s, i) => {
          const currentIdx = steps.findIndex((st) => st.id === step);
          const isCompleted = currentIdx > i;
          const isCurrent = currentIdx === i;
          return (
            <div key={s.id} className="flex items-center">
              <div className="flex flex-col items-center gap-1.5">
                <motion.div
                  animate={{
                    scale: isCurrent ? 1.1 : 1,
                    backgroundColor: isCompleted || isCurrent ? 'var(--primary)' : 'var(--muted)',
                  }}
                  transition={{ duration: 0.3 }}
                  className={`size-9 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    isCompleted || isCurrent
                      ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/30'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {isCompleted ? (
                    <Check size={14} />
                  ) : (
                    i + 1
                  )}
                </motion.div>
                <span className={`text-[10px] font-medium ${isCurrent ? 'text-foreground' : 'text-muted-foreground/50'}`}>
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className="flex items-center mx-2 sm:mx-4">
                  <motion.div
                    animate={{ backgroundColor: isCompleted ? 'var(--primary)' : 'var(--border)' }}
                    className="w-10 sm:w-16 h-0.5 rounded-full"
                  />
                </div>
              )}
            </div>
          );
        })}
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-destructive/10 border border-destructive/20 text-destructive p-3 rounded-lg text-sm"
        >
          {error}
        </motion.div>
      )}

      <motion.div
        key={step}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        {step === 'type' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {typeOptions.map((opt) => (
              <motion.button
                key={opt.id}
                onClick={() => handleTypeSelect(opt.id)}
                whileHover={{ y: -3, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="group relative overflow-hidden rounded-xl border-2 border-border/60 bg-card p-6 text-left transition-all hover:shadow-lg text-start"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${opt.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="absolute -top-8 -right-8 size-24 rounded-full bg-gradient-to-br from-foreground/[0.02] to-transparent blur-2xl group-hover:scale-150 transition-transform duration-700" />
                <div className="relative space-y-4">
                  <div className={`size-12 rounded-xl ${opt.iconBg} flex items-center justify-center ring-1 ring-foreground/5`}>
                    <opt.icon size={22} className={opt.id === 'website' ? 'text-primary' : 'text-secondary'} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{opt.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{opt.description}</p>
                  </div>
                  <ul className="space-y-1.5">
                    {opt.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground/70">
                        <Check size={10} className="text-success shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center gap-1 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    Select {opt.title}
                    <ChevronRight size={12} />
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        )}

        {step === 'details' && (
          <Card className="overflow-hidden border-border/60">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent pointer-events-none" />
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className={`size-8 rounded-lg ${type === 'website' ? 'bg-primary/10' : 'bg-secondary/10'} flex items-center justify-center`}>
                  {type === 'website' ? (
                    <Globe size={15} className="text-primary" />
                  ) : (
                    <Database size={15} className="text-secondary" />
                  )}
                </div>
                <div>
                  <CardTitle className="text-base">
                    {type === 'website' ? 'Website Details' : 'Database Details'}
                  </CardTitle>
                  <CardDescription>
                    {type === 'website'
                      ? 'Enter the URL of the website you want to monitor'
                      : 'Configure your database connection'}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => { e.preventDefault(); setStep('review'); }} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                    <Server size={12} className="text-muted-foreground" />
                    Title
                  </label>
                  <Input
                    placeholder="My Production Server"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="h-10"
                  />
                  <p className="text-[10px] text-muted-foreground/50">A friendly name to identify this service</p>
                </div>

                <Separator className="bg-border/40" />

                {type === 'database' && (
                  <div className="space-y-3">
                    <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                      <Terminal size={12} className="text-muted-foreground" />
                      Database Type
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { id: 'mongodb' as const, label: 'MongoDB', desc: 'NoSQL document database', icon: Database },
                        { id: 'sql' as const, label: 'SQL', desc: 'PostgreSQL, MySQL, Supabase', icon: Server },
                      ].map((opt) => (
                        <motion.button
                          key={opt.id}
                          type="button"
                          onClick={() => setDbType(opt.id)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`relative p-4 rounded-lg border-2 text-left transition-all ${
                            dbType === opt.id
                              ? 'border-primary bg-primary/5 shadow-sm shadow-primary/10'
                              : 'border-border/60 hover:border-muted-foreground/30 bg-card'
                          }`}
                        >
                          {dbType === opt.id && (
                            <motion.div
                              layoutId="dbCheck"
                              className="absolute top-2 right-2 size-5 rounded-full bg-primary flex items-center justify-center"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                            >
                              <Check size={10} className="text-primary-foreground" />
                            </motion.div>
                          )}
                          <opt.icon size={18} className={dbType === opt.id ? 'text-primary' : 'text-muted-foreground'} />
                          <p className="font-medium text-sm text-foreground mt-2">{opt.label}</p>
                          <p className="text-xs text-muted-foreground/60 mt-0.5">{opt.desc}</p>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                    <LinkIcon size={12} className="text-muted-foreground" />
                    {type === 'website' ? 'Website URL' : 'Connection URI'}
                  </label>
                  <Input
                    placeholder={
                      type === 'website'
                        ? 'https://example.com'
                        : dbType === 'mongodb'
                        ? 'mongodb+srv://user:pass@cluster.mongodb.net/db'
                        : 'postgresql://user:pass@host:5432/db'
                    }
                    value={uri}
                    onChange={(e) => setUri(e.target.value)}
                    required
                    className="h-10 font-mono text-xs"
                  />
                  <p className="text-[10px] text-muted-foreground/50">
                    {type === 'website'
                      ? 'Full URL including https://'
                      : 'This will be encrypted before storage'}
                  </p>
                </div>

                {type === 'database' && (
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                      <Terminal size={12} className="text-muted-foreground" />
                      {dbType === 'mongodb' ? 'Collection Name' : 'Table Name'}
                    </label>
                    <Input
                      placeholder={dbType === 'mongodb' ? 'users' : 'users_table'}
                      value={collectionOrTable}
                      onChange={(e) => setCollectionOrTable(e.target.value)}
                      required
                      className="h-10"
                    />
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                  <Button type="submit" disabled={type === 'database' && !dbType} className="w-full sm:w-auto gap-1.5">
                    Continue to Review
                    <ChevronRight size={14} />
                  </Button>
                  <Button type="button" variant="outline" onClick={handleBack} className="w-full sm:w-auto">
                    Back
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {step === 'review' && (
          <Card className="overflow-hidden border-border/60">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent pointer-events-none" />
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-lg bg-success/10 flex items-center justify-center">
                  <Shield size={15} className="text-success" />
                </div>
                <div>
                  <CardTitle className="text-base">Review Kaffeiner</CardTitle>
                  <CardDescription>Confirm the details below before creating</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-muted/30 border border-border/30">
                  <div className="space-y-1">
                    <p className="text-[10px] text-muted-foreground/50 uppercase tracking-wider font-medium">Title</p>
                    <p className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                      <Server size={13} className="text-muted-foreground/50" />
                      {title}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-muted-foreground/50 uppercase tracking-wider font-medium">Type</p>
                    <p className="text-sm font-medium text-foreground flex items-center gap-1.5 capitalize">
                      {type === 'website' ? (
                        <Globe size={13} className="text-primary" />
                      ) : (
                        <Database size={13} className="text-secondary" />
                      )}
                      {type}
                    </p>
                  </div>
                  {type === 'database' && (
                    <>
                      <div className="space-y-1">
                        <p className="text-[10px] text-muted-foreground/50 uppercase tracking-wider font-medium">Database Type</p>
                        <p className="text-sm font-medium text-foreground capitalize">{dbType}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] text-muted-foreground/50 uppercase tracking-wider font-medium">
                          {dbType === 'mongodb' ? 'Collection' : 'Table'}
                        </p>
                        <p className="text-sm font-mono font-medium text-foreground">{collectionOrTable}</p>
                      </div>
                    </>
                  )}
                  <div className="col-span-1 sm:col-span-2 space-y-1">
                    <p className="text-[10px] text-muted-foreground/50 uppercase tracking-wider font-medium">
                      {type === 'website' ? 'URL' : 'Connection URI'}
                    </p>
                    <p className="text-sm font-mono text-foreground bg-background/50 px-2.5 py-1.5 rounded-md border border-border/30 truncate">
                      {uri}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <Button onClick={handleSubmit} disabled={submitting} className="gap-2 w-full sm:w-auto">
                    <Coffee size={16} />
                    {submitting ? 'Creating...' : 'Create Kaffeiner'}
                  </Button>
                  <Button type="button" variant="outline" onClick={handleBack} className="w-full sm:w-auto">
                    Edit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  );
}
