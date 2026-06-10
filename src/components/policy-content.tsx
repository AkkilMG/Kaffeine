'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

function parseMarkdownTable(text: string) {
  const lines = text.trim().split('\n').filter((l) => l.trim());
  const headerLine = lines[0] || '';
  const headers = headerLine.split('|').filter((h) => h.trim()).map((h) => h.trim());
  const rows = lines.slice(2).map((line) =>
    line.split('|').filter((c) => c.trim()).map((c) => c.trim()),
  );
  return { headers, rows };
}

export function PolicyContent({ content }: { content: string }) {
  const blocks = content.split('\n\n');
  return blocks.map((block, i) => {
    if (block.includes('|---|')) {
      const { headers, rows } = parseMarkdownTable(block);
      if (headers.length === 0) return null;
      return (
        <div key={i} className="overflow-x-auto mb-3">
          <Table>
            <TableHeader>
              <TableRow>
                {headers.map((h, hi) => (
                  <TableHead key={hi} className="text-xs uppercase tracking-wider whitespace-normal min-w-[120px]">
                    {h}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, ri) => (
                <TableRow key={ri}>
                  {row.map((cell, ci) => (
                    <TableCell key={ci} className="text-xs whitespace-normal min-w-[120px]">
                      {cell}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      );
    }
    return (
      <p key={i} className="text-sm text-muted-foreground leading-relaxed mb-3 last:mb-0 whitespace-pre-line">
        {block}
      </p>
    );
  });
}
