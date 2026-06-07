import { FileText } from 'lucide-react';

export const LandingCta = () => (
    <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto rounded-4xl bg-[#101a3d] text-white relative overflow-hidden px-10 py-14 flex flex-col sm:flex-row items-center gap-8">
            <div className="absolute -top-10 right-0 size-80 rounded-full bg-primary/30 blur-3xl pointer-events-none" />

            <div className="size-24 rounded-3xl bg-sky-300 flex items-center justify-center shrink-0">
                <FileText className="size-12 text-[#101a3d]" />
            </div>

            <div className="relative flex-1 text-center sm:text-left">
                <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight">
                    O seu laudo está esperando por você
                </h2>
                <p className="mt-2 text-white/60 text-lg">
                    Use o link que a clínica enviou para acessar.
                </p>
            </div>
        </div>
    </section>
);
