
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Check } from 'lucide-react';

const PricingCard = ({ title, price, description, features, buttonText, buttonVariant = "default", badge, highlighted = false }) => {
  return (
    <Card className={`relative ${highlighted ? 'border-primary shadow-lg scale-105' : 'border-border'} transition-all duration-200`}>
      {badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
            {badge}
          </span>
        </div>
      )}
      <CardHeader className="text-center pb-8 pt-8">
        <CardTitle className="text-2xl mb-2">{title}</CardTitle>
        <div className="mb-2">
          <span className="text-4xl font-bold">{price}</span>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-sm text-foreground">{feature}</span>
            </li>
          ))}
        </ul>
        <Button 
          variant={buttonVariant} 
          className="w-full transition-all duration-200"
          size="lg"
        >
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PricingCard;
