import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useDiagnoses, type Outcome, type Diagnosis } from '@/hooks/useDiagnoses';
import { toast } from 'sonner';
import { Sprout, CheckCircle2, TrendingUp, Minus, TrendingDown, Loader2 } from 'lucide-react';

/**
 * Four answers, one tap each. Any extra field here costs completion rate, and
 * a follow-up nobody answers is worth nothing.
 */
const CHOICES: { value: Outcome; en: string; hi: string; Icon: typeof CheckCircle2; tone: string }[] = [
  { value: 'cured', en: 'Cured', hi: 'ठीक हो गई', Icon: CheckCircle2, tone: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
  { value: 'improved', en: 'Better', hi: 'बेहतर है', Icon: TrendingUp, tone: 'border-sky-500/50 bg-sky-500/10 text-sky-600 dark:text-sky-400' },
  { value: 'no_change', en: 'No change', hi: 'कोई बदलाव नहीं', Icon: Minus, tone: 'border-amber-500/50 bg-amber-500/10 text-amber-600 dark:text-amber-400' },
  { value: 'worsened', en: 'Worse', hi: 'और बिगड़ गई', Icon: TrendingDown, tone: 'border-red-500/50 bg-red-500/10 text-red-600 dark:text-red-400' },
];

function Card({ d, onAnswer }: { d: Diagnosis; onAnswer: (o: Outcome) => Promise<void> }) {
  const { tx, language } = useLanguage();
  const [busy, setBusy] = useState<Outcome | null>(null);

  const days = Math.max(
    1,
    Math.floor((Date.now() - new Date(d.created_at).getTime()) / 86400000),
  );

  return (
    <article className="rounded-2xl border border-primary/30 bg-card p-5">
      <div className="mb-1 flex items-center gap-2">
        <Sprout className="h-5 w-5 text-primary" />
        <h3 className="font-bold text-foreground">
          {tx('Did the treatment work?', 'क्या इलाज काम आया?')}
        </h3>
      </div>

      <p className="mb-4 text-sm text-muted-foreground">
        {tx(
          'You scanned {crop} for {disease} {n} days ago.',
          'आपने {n} दिन पहले {crop} में {disease} की जाँच की थी।',
        )
          .replace('{crop}', d.crop_name || tx('a crop', 'एक फसल'))
          .replace('{disease}', d.disease_name || tx('a problem', 'एक समस्या'))
          .replace('{n}', String(days))}
      </p>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {CHOICES.map((c) => (
          <button
            key={c.value}
            disabled={busy !== null}
            onClick={async () => {
              setBusy(c.value);
              await onAnswer(c.value);
              setBusy(null);
            }}
            className={`flex min-h-11 flex-col items-center justify-center gap-1 rounded-xl border px-3 py-3 text-sm font-semibold transition-transform active:scale-95 disabled:opacity-60 ${c.tone}`}
          >
            {busy === c.value ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <c.Icon className="h-5 w-5" />
            )}
            {language === 'hi' ? c.hi : c.en}
          </button>
        ))}
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        {tx(
          'Your answer improves the advice the next farmer gets.',
          'आपका जवाब अगले किसान को बेहतर सलाह देता है।',
        )}
      </p>
    </article>
  );
}

/**
 * Asks, a week after a diagnosis, whether the treatment actually worked.
 *
 * This is the only part of the product a competitor cannot copy by shipping
 * the same feature. Photographs of sick plants are abundant; labelled
 * outcomes are not, and they can only be earned one harvest at a time.
 *
 * Renders nothing when there is nothing to ask, so it can sit on the home
 * screen permanently without becoming clutter.
 */
export default function FollowUpPrompt({ limit = 2 }: { limit?: number }) {
  const { tx } = useLanguage();
  const { pending, recordOutcome, loading } = useDiagnoses();

  if (loading || pending.length === 0) return null;

  const answer = async (id: string, outcome: Outcome) => {
    const ok = await recordOutcome(id, outcome);
    toast[ok ? 'success' : 'error'](
      ok
        ? tx('Thank you — that helps every farmer after you.', 'धन्यवाद — इससे हर अगले किसान को मदद मिलेगी।')
        : tx('Could not save that. Try again.', 'सहेजा नहीं जा सका। दोबारा कोशिश करें।'),
    );
  };

  return (
    <section className="mb-8 space-y-3">
      {pending.slice(0, limit).map((d) => (
        <Card key={d.id} d={d} onAnswer={(o) => answer(d.id, o)} />
      ))}
    </section>
  );
}
