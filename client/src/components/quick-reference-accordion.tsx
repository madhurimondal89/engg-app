import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { BookOpen } from 'lucide-react';
import {
  getHowToUse,
  getEngineeringExplanation,
  getPracticalApplications,
  getFAQs,
} from '@/lib/calculator-content';

export interface QuickReferenceAccordionProps {
  formulaInfo: {
    name: string;
    formula?: string;
    description?: string;
    variables?: Record<string, string>;
    id?: string;
  } | null | undefined;
  discipline?: string;
}

export function QuickReferenceAccordion({
  formulaInfo,
  discipline = 'mechanical',
}: QuickReferenceAccordionProps) {
  if (!formulaInfo) return null;

  return (
    <Card className="mt-6 border-0 shadow-none bg-transparent">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center font-outfit">
          <BookOpen className="h-5 w-5 text-blue-600 dark:text-cyan-400 mr-2" />
          Quick Reference - {formulaInfo.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        <Accordion
          type="single"
          collapsible
          className="w-full bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 px-4 sm:px-6 shadow-sm divide-y divide-slate-100 dark:divide-slate-800"
        >
          {/* How to use */}
          <AccordionItem value="how-to-use" className="border-b-0 py-1">
            <AccordionTrigger className="text-base font-semibold text-slate-800 dark:text-slate-100 py-4 hover:no-underline hover:text-blue-600 dark:hover:text-cyan-400 font-outfit text-left">
              How to Use This Calculator
            </AccordionTrigger>
            <AccordionContent className="text-slate-600 dark:text-slate-300 pb-5 leading-relaxed text-sm">
              {getHowToUse(formulaInfo, 'this tool')}
            </AccordionContent>
          </AccordionItem>

          {/* Formula used */}
          {formulaInfo.formula && (
            <AccordionItem value="formula-used" className="border-b-0 py-1">
              <AccordionTrigger className="text-base font-semibold text-slate-800 dark:text-slate-100 py-4 hover:no-underline hover:text-blue-600 dark:hover:text-cyan-400 font-outfit text-left">
                Formula Used
              </AccordionTrigger>
              <AccordionContent className="pb-5">
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50 dark:bg-slate-950/70 mt-1 space-y-2.5">
                  <div className="font-bold text-base text-slate-900 dark:text-white font-outfit">
                    {formulaInfo.name}
                  </div>
                  <div>
                    <span className="font-mono text-sm font-semibold text-cyan-700 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800/80 px-3 py-1.5 rounded-lg inline-block break-all">
                      {formulaInfo.formula}
                    </span>
                  </div>
                  {formulaInfo.description && (
                    <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {formulaInfo.description}
                    </div>
                  )}
                  {formulaInfo.variables && Object.keys(formulaInfo.variables).length > 0 && (
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-mono border-t border-slate-200 dark:border-slate-800 pt-2.5 mt-2">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Variables Mapping: </span>
                      {Object.entries(formulaInfo.variables)
                        .map(([k, v]) => `${k} = ${v}`)
                        .join(', ')}
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Engineering Explanation */}
          <AccordionItem value="explanation" className="border-b-0 py-1">
            <AccordionTrigger className="text-base font-semibold text-slate-800 dark:text-slate-100 py-4 hover:no-underline hover:text-blue-600 dark:hover:text-cyan-400 font-outfit text-left">
              Engineering Explanation
            </AccordionTrigger>
            <AccordionContent className="pb-5 text-slate-600 dark:text-slate-300 leading-relaxed text-sm space-y-3">
              {getEngineeringExplanation(discipline, formulaInfo, 'this system')}
            </AccordionContent>
          </AccordionItem>

          {/* Practical Applications */}
          <AccordionItem value="applications" className="border-b-0 py-1">
            <AccordionTrigger className="text-base font-semibold text-slate-800 dark:text-slate-100 py-4 hover:no-underline hover:text-blue-600 dark:hover:text-cyan-400 font-outfit text-left">
              Practical Applications
            </AccordionTrigger>
            <AccordionContent className="pb-5 text-slate-600 dark:text-slate-300 leading-relaxed text-sm space-y-3">
              {getPracticalApplications(discipline, formulaInfo, 'these')}
            </AccordionContent>
          </AccordionItem>

          {/* FAQs */}
          <AccordionItem value="faqs" className="border-b-0 py-1">
            <AccordionTrigger className="text-base font-semibold text-slate-800 dark:text-slate-100 py-4 hover:no-underline hover:text-blue-600 dark:hover:text-cyan-400 font-outfit text-left">
              Frequently Asked Questions
            </AccordionTrigger>
            <AccordionContent className="space-y-3 pb-5">
              {getFAQs(formulaInfo, 'calculator').map((faq, i) => (
                <div
                  key={i}
                  className="bg-slate-50 dark:bg-slate-950/70 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5"
                >
                  <strong className="text-slate-900 dark:text-white block font-semibold text-sm">
                    Q: {faq.question}
                  </strong>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    A: {faq.answer}
                  </p>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
