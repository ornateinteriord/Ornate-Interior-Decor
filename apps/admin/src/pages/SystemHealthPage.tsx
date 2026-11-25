import React from "react";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Cloud, Database, Shield } from "lucide-react";
import { adminApi } from "@/lib/adminApi";

interface SystemDbRow {
  dbName: string;
  domain: string;
  collections?: string[];
}

interface SystemPaymentLog {
  id: string;
  event: string;
  orderNumber: string;
  razorpayOrderId?: string;
  mode: string;
}

interface SystemAuditLog {
  id: string;
  action: string;
  adminEmail: string;
  summary: string;
}

export const SystemHealthPage: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-system"],
    queryFn: async () => (await adminApi.get("/system")).data.data,
  });

  if (isLoading) {
    return <p className="text-sm text-ornate-charcoal/60">Checking system health...</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-display uppercase tracking-widest text-ornate-darkgold">
          Infrastructure &amp; Logs
        </p>
        <h2 className="font-serif text-3xl text-ornate-charcoal">
          Multi-DB, ImageKit &amp; Razorpay Status
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-ornate-gold/25 rounded-lg p-5 space-y-1.5">
          <p className="text-xs font-display uppercase tracking-wider text-ornate-darkgold flex items-center gap-1.5">
            <Database size={14} /> MongoDB Cluster
          </p>
          <p className="font-serif text-xl">{data?.databases?.status}</p>
          <p className="text-xs text-ornate-charcoal/65">
            {data?.databases?.databases?.length || 0} isolated logical databases active
          </p>
        </div>

        <div className="bg-white border border-ornate-gold/25 rounded-lg p-5 space-y-1.5">
          <p className="text-xs font-display uppercase tracking-wider text-ornate-darkgold flex items-center gap-1.5">
            <Cloud size={14} /> ImageKit CDN
          </p>
          <p className="font-serif text-xl">
            {data?.imagekit?.configured ? "Configured" : "Missing Keys"}
          </p>
          <p className="text-xs text-ornate-charcoal/65 truncate">
            Folder: /{data?.imagekit?.folder}
          </p>
        </div>

        <div className="bg-white border border-ornate-gold/25 rounded-lg p-5 space-y-1.5">
          <p className="text-xs font-display uppercase tracking-wider text-ornate-darkgold flex items-center gap-1.5">
            <Shield size={14} /> Razorpay Gateway
          </p>
          <p className="font-serif text-xl">{data?.razorpayMode}</p>
          <p className="text-xs text-ornate-charcoal/65">
            HMAC SHA256 verification active
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {(data?.databases?.databases || []).map((db: SystemDbRow) => (
          <div
            key={db.dbName}
            className="bg-white border border-ornate-gold/25 rounded-lg p-4 space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-sm">{db.dbName}</span>
              <CheckCircle2 size={15} className="text-emerald-600" />
            </div>
            <p className="text-xs text-ornate-charcoal/65">Domain: {db.domain}</p>
            <div className="flex flex-wrap gap-1 pt-1">
              {(db.collections || []).map((col: string) => (
                <span
                  key={col}
                  className="px-2 py-0.5 rounded bg-ornate-offwhite border border-ornate-gold/20 text-[11px]"
                >
                  {col}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-ornate-gold/25 rounded-lg p-5">
          <h3 className="font-serif text-lg mb-3">Recent Razorpay Payment Logs</h3>
          <div className="space-y-2 max-h-80 overflow-y-auto text-xs">
            {(data?.paymentLogs || []).map((log: SystemPaymentLog) => (
              <div key={log.id} className="p-2.5 rounded bg-ornate-offwhite border border-ornate-gold/15">
                <div className="flex justify-between font-medium">
                  <span>{log.event}</span>
                  <span>{log.orderNumber}</span>
                </div>
                <p className="text-ornate-charcoal/65 mt-0.5">
                  RZP Order: {log.razorpayOrderId || "—"} · {log.mode}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-ornate-gold/25 rounded-lg p-5">
          <h3 className="font-serif text-lg mb-3">Admin Audit Trail</h3>
          <div className="space-y-2 max-h-80 overflow-y-auto text-xs">
            {(data?.auditLogs || []).map((log: SystemAuditLog) => (
              <div key={log.id} className="p-2.5 rounded bg-ornate-offwhite border border-ornate-gold/15">
                <div className="flex justify-between font-medium">
                  <span>{log.action}</span>
                  <span className="text-ornate-charcoal/60">{log.adminEmail}</span>
                </div>
                <p className="text-ornate-charcoal/75 mt-0.5">{log.summary}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
