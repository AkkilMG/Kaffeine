'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe, Database, ArrowLeft, Coffee } from 'lucide-react';
import Link from 'next/link';
import { useKaffeiners } from '@/hooks/use-data';

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
    <div className="p-4 md:p-8 max-w-2xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-4"
      >
        <Link
          href="/dashboard/kaffeiners"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">New Kaffeiner</h1>
          <p className="text-muted-foreground text-sm">Add a service to monitor</p>
        </div>
      </motion.div>

      {/* Step indicator */}
      <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm overflow-x-auto pb-1">
        {['type', 'details', 'review'].map((s, i) => (
          <div key={s} className="flex items-center gap-1 sm:gap-2 shrink-0">
            <span
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-medium transition-colors ${
                step === s
                  ? 'bg-primary text-primary-foreground'
                  : ['type', 'details'].includes(step) && s !== step
                  ? 'bg-muted text-muted-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {['type', 'details', 'review'].indexOf(step) > i ? '✓' : i + 1}
            </span>
            <span className={`hidden sm:inline ${step === s ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
              {s === 'type' ? 'Type' : s === 'details' ? 'Details' : 'Review'}
            </span>
            {i < 2 && <div className="w-4 sm:w-8 h-px bg-border" />}
          </div>
        ))}
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-destructive/10 text-destructive p-3 rounded-md text-sm"
        >
          {error}
        </motion.div>
      )}

      <motion.div
        key={step}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {step === 'type' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => handleTypeSelect('website')}
              className="group relative overflow-hidden rounded-xl border-2 border-border hover:border-primary bg-card p-8 text-left transition-all hover:shadow-lg hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <Globe className="size-10 text-primary mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Website</h3>
              <p className="text-sm text-muted-foreground">
                Monitor website uptime by sending periodic HTTP requests.
              </p>
            </button>

            <button
              onClick={() => handleTypeSelect('database')}
              className="group relative overflow-hidden rounded-xl border-2 border-border hover:border-primary bg-card p-8 text-left transition-all hover:shadow-lg hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <Database className="size-10 text-secondary mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Database</h3>
              <p className="text-sm text-muted-foreground">
                Monitor database connectivity for MongoDB, PostgreSQL, MySQL, and more.
              </p>
            </button>
          </div>
        )}

        {step === 'details' && (
          <Card>
            <CardHeader>
              <CardTitle>
                {type === 'website' ? 'Website Details' : 'Database Details'}
              </CardTitle>
              <CardDescription>
                {type === 'website'
                  ? 'Enter the URL of the website you want to monitor'
                  : 'Configure your database connection'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => { e.preventDefault(); setStep('review'); }} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    placeholder="My Production Server"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                {type === 'database' && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Database Type</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setDbType('mongodb')}
                        className={`p-4 rounded-lg border-2 text-left transition-all ${
                          dbType === 'mongodb'
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-muted-foreground'
                        }`}
                      >
                        <p className="font-medium text-foreground">MongoDB</p>
                        <p className="text-xs text-muted-foreground mt-1">NoSQL document database</p>
                      </button>
                      <button
                        type="button"
                        onClick={() => setDbType('sql')}
                        className={`p-4 rounded-lg border-2 text-left transition-all ${
                          dbType === 'sql'
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-muted-foreground'
                        }`}
                      >
                        <p className="font-medium text-foreground">SQL</p>
                        <p className="text-xs text-muted-foreground mt-1">PostgreSQL, MySQL, Supabase</p>
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium">
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
                  />
                  <p className="text-xs text-muted-foreground">
                    {type === 'website'
                      ? 'Full URL including https://'
                      : 'This will be encrypted before storage'}
                  </p>
                </div>

                {type === 'database' && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      {dbType === 'mongodb' ? 'Collection Name' : 'Table Name'}
                    </label>
                    <Input
                      placeholder={dbType === 'mongodb' ? 'users' : 'users_table'}
                      value={collectionOrTable}
                      onChange={(e) => setCollectionOrTable(e.target.value)}
                      required
                    />
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4">
                  <Button type="submit" disabled={type === 'database' && !dbType} className="w-full sm:w-auto">
                    Continue to Review
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
          <Card>
            <CardHeader>
              <CardTitle>Review Kaffeiner</CardTitle>
              <CardDescription>Confirm the details below</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg bg-muted/50">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Title</p>
                    <p className="text-sm font-medium text-foreground mt-1">{title}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Type</p>
                    <p className="text-sm font-medium text-foreground mt-1 capitalize">{type}</p>
                  </div>
                  {type === 'database' && (
                    <>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Database Type</p>
                        <p className="text-sm font-medium text-foreground mt-1 capitalize">{dbType}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">
                          {dbType === 'mongodb' ? 'Collection' : 'Table'}
                        </p>
                        <p className="text-sm font-medium text-foreground mt-1">{collectionOrTable}</p>
                      </div>
                    </>
                  )}
                  <div className="col-span-1 sm:col-span-2">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">
                      {type === 'website' ? 'URL' : 'Connection URI'}
                    </p>
                    <p className="text-sm font-mono text-foreground mt-1 truncate">{uri}</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
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
