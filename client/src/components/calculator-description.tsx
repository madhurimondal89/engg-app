import React from 'react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { calculatorDescriptions } from '@/lib/calculator-content';

interface CalculatorDescriptionProps {
    activeCalculator: string;
}

export const CalculatorDescription: React.FC<CalculatorDescriptionProps> = ({ activeCalculator }) => {
    const description = calculatorDescriptions[activeCalculator];

    if (!description) return null;

    // Simple markdown renderer for the descriptions
    const renderContent = (text: string) => {
        return text.split('\n').map((line, index) => {
            if (line.startsWith('### ')) {
                return <h3 key={index} className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-4 mb-2">{line.replace('### ', '')}</h3>;
            }
            if (line.startsWith('**') && line.endsWith('**')) { // Simple bold line check
                return <strong key={index} className="block font-medium text-gray-900 dark:text-gray-100 mt-2">{line.replace(/\*\*/g, '')}</strong>;
            }
            if (line.trim() === '') {
                return <br key={index} />;
            }
            // Parse inline bolding **text**
            const parts = line.split(/(\*\*.*?\*\*)/g);
            return (
                <p key={index} className="mb-2">
                    {parts.map((part, i) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                            return <strong key={i}>{part.slice(2, -2)}</strong>;
                        }
                        return part;
                    })}
                </p>
            );
        });
    };

    return (
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="description" className="border-b-0">
                    <AccordionTrigger className="px-6 py-4 text-lg font-semibold text-charcoal dark:text-gray-100 hover:text-eng-blue hover:no-underline">
                        <div className="flex items-center">
                            <span>Learn More about {activeCalculator.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6 text-gray-600 dark:text-gray-300 leading-relaxed">
                        <div className="prose dark:prose-invert max-w-none">
                            {renderContent(description)}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
};
