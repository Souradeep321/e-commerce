"use client";

import { motion } from "motion/react";
import { Truck, RotateCcw, ShieldCheck, Headset } from "lucide-react";

const values = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "On orders above ₹2,000",
  },
  {
    icon: RotateCcw,
    title: "30-Day Returns",
    description: "Hassle-free, no questions asked",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payment",
    description: "Encrypted & PCI compliant",
  },
  {
    icon: Headset,
    title: "24/7 Support",
    description: "Always here when you need us",
  },
];

export function ValuePropStrip() {
  return (
    <section className="border-t border-neutral-200">
      <div className="mx-auto grid max-w-7xl grid-cols-2 divide-y divide-neutral-200 sm:grid-cols-4 sm:divide-y-0 sm:divide-x">
        {values.map((value, index) => (
          <motion.div
            key={value.title}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
            className="flex flex-col items-center gap-2 px-4 py-10 text-center"
          >
            <value.icon className="h-5 w-5 text-neutral-400" strokeWidth={1.5} />
            <p className="text-xs uppercase tracking-wide text-neutral-900">
              {value.title}
            </p>
            <p className="text-xs text-neutral-500">{value.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}