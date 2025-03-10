import React, { useState, useEffect } from 'react';

import { Slider } from './components/ui/slider';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from './components/ui/card';
import { Input } from './components/ui/input';
import { Button } from './components/ui/button';
import { Label } from './components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { ArrowRight, Check, DollarSign, PieChart, Percent, Briefcase, Globe } from 'lucide-react';


const ValuePricingCalculator = () => {
  // State for BAM calculation
  const [bamInputs, setBamInputs] = useState({
    monthlySalary: 5000,
    monthlyProfit: 1667,
    monthlyExpenses: 1250,
    monthlyBillableHours: 100, // Default: 25 hours/week, 4 weeks/month
  });

  // State for value assessment
  const [valueInputs, setValueInputs] = useState({
    quantitativeValue: { 
      percentage: 20, 
      description: "How will this impact measurable metrics? Revenue, time savings, efficiency gains, etc.", 
      cost: 10000,
      examples: [
        "20% increase in conversion rate = $200,000 additional revenue",
        "15 hours saved per week @ $150/hr = $9,000/month"
      ]
    },
    qualitativeValue: { 
      percentage: 20, 
      description: "What intangible benefits will the client receive? Status, positioning, reputation, etc.", 
      cost: 15000,
      examples: [
        "Enhanced brand perception worth 25% premium on services",
        "Industry leadership position valued at $45,000 annually"
      ]
    },
    emotionalValue: { 
      percentage: 20, 
      description: "How will this make the client feel? What pain points will it resolve? Peace of mind?", 
      cost: 12000,
      examples: [
        "Stress reduction valued at $4,000/month for leadership team",
        "Peace of mind from reliable systems = $36,000 annually"
      ]
    },
    strategicValue: { 
      percentage: 20, 
      description: "How does this contribute to long-term goals? Competitive advantage? Market position?", 
      cost: 25000,
      examples: [
        "New market access worth $150,000 in future revenue",
        "Competitive edge valued at 15% of annual revenue ($75,000)"
      ]
    },
    aestheticValue: { 
      percentage: 20, 
      description: "How does the experience feel? Visual appeal? User experience? Brand impression?", 
      cost: 18000,
      examples: [
        "Premium design commanding 35% price increase on products",
        "Improved user experience reducing churn by $8,000/month"
      ]
    },
  });

  // State for client budget and value multiplier
  const [clientBudget, setClientBudget] = useState('');
  const [valuePercentage, setValuePercentage] = useState(0.18); // Default 18% (middle of 12-25% range)
  const [currency, setCurrency] = useState('USD');
  const [selectedIndustry, setSelectedIndustry] = useState('general');
  
  // Calculated results
  const [bam, setBam] = useState(0);
  const [totalValue, setTotalValue] = useState(0);
  const [projectPrice, setProjectPrice] = useState(0);
  const [activeTab, setActiveTab] = useState('bam');
  
  // Industry-specific base values
  const industryBaseValues = {
    general: 80000,
    tech: 120000,
    finance: 150000,
    healthcare: 100000,
    ecommerce: 90000,
    marketing: 70000,
    education: 60000,
    nonprofit: 50000,
    construction: 85000,
    manufacturing: 95000,
    creative: 65000,
    legal: 110000
  };
  
  // Industry-specific value distribution
  const industryDistributions = {
    general: {
      quantitativeValue: 0.35,
      strategicValue: 0.25,
      qualitativeValue: 0.15, 
      emotionalValue: 0.15,
      aestheticValue: 0.10
    },
    tech: {
      quantitativeValue: 0.40,
      strategicValue: 0.30,
      qualitativeValue: 0.10,
      emotionalValue: 0.05,
      aestheticValue: 0.15
    },
    finance: {
      quantitativeValue: 0.45,
      strategicValue: 0.30,
      qualitativeValue: 0.10,
      emotionalValue: 0.05,
      aestheticValue: 0.10
    },
    healthcare: {
      quantitativeValue: 0.30,
      strategicValue: 0.25,
      qualitativeValue: 0.15,
      emotionalValue: 0.20,
      aestheticValue: 0.10
    },
    ecommerce: {
      quantitativeValue: 0.40,
      strategicValue: 0.20,
      qualitativeValue: 0.10,
      emotionalValue: 0.10,
      aestheticValue: 0.20
    },
    marketing: {
      quantitativeValue: 0.30,
      strategicValue: 0.20,
      qualitativeValue: 0.20,
      emotionalValue: 0.10,
      aestheticValue: 0.20
    },
    education: {
      quantitativeValue: 0.25,
      strategicValue: 0.20,
      qualitativeValue: 0.25,
      emotionalValue: 0.20,
      aestheticValue: 0.10
    },
    nonprofit: {
      quantitativeValue: 0.20,
      strategicValue: 0.20,
      qualitativeValue: 0.30,
      emotionalValue: 0.20,
      aestheticValue: 0.10
    },
    construction: {
      quantitativeValue: 0.40,
      strategicValue: 0.25,
      qualitativeValue: 0.15,
      emotionalValue: 0.10,
      aestheticValue: 0.10
    },
    manufacturing: {
      quantitativeValue: 0.45,
      strategicValue: 0.25,
      qualitativeValue: 0.10,
      emotionalValue: 0.10,
      aestheticValue: 0.10
    },
    creative: {
      quantitativeValue: 0.20,
      strategicValue: 0.20,
      qualitativeValue: 0.20,
      emotionalValue: 0.15,
      aestheticValue: 0.25
    },
    legal: {
      quantitativeValue: 0.35,
      strategicValue: 0.30,
      qualitativeValue: 0.20,
      emotionalValue: 0.10,
      aestheticValue: 0.05
    }
  };
  
  // Handle BAM input changes
  const handleBamInputChange = (e) => {
    const { name, value } = e.target;
    setBamInputs({
      ...bamInputs,
      [name]: value === '' ? '' : parseFloat(value)
    });
  };
  
  // Handle value percentage changes
  const handleValuePercentageChange = (valueType, newPercentage) => {
    // Update the percentage for the specific value type
    setValueInputs(prev => ({
      ...prev,
      [valueType]: {
        ...prev[valueType],
        percentage: newPercentage
      }
    }));
  };
  
  // Handle value cost changes
  const handleValueCostChange = (valueType, newCost) => {
    // Update the cost for the specific value type
    setValueInputs(prev => ({
      ...prev,
      [valueType]: {
        ...prev[valueType],
        cost: newCost === '' ? '' : parseFloat(newCost)
      }
    }));
  };
  
  // Handle client budget change
  const handleBudgetChange = (e) => {
    setClientBudget(e.target.value === '' ? '' : parseFloat(e.target.value));
  };
  
  // Handle value multiplier change
  const handlePercentageChange = (value) => {
    setValuePercentage(value[0] || 0.18);
  };
  
  // Calculate BAM whenever inputs change
  useEffect(() => {
    if (bamInputs.monthlyBillableHours > 0) {
      const totalMonthlyIncome = bamInputs.monthlySalary + bamInputs.monthlyProfit + bamInputs.monthlyExpenses;
      const calculatedBam = totalMonthlyIncome / bamInputs.monthlyBillableHours;
      setBam(calculatedBam);
    }
  }, [bamInputs]);
  
  // Ensure value percentages total to 100%
  useEffect(() => {
    const total = Object.values(valueInputs).reduce((sum, value) => sum + (parseFloat(value.percentage) || 0), 0);
    
    // Only normalize if total is not 100% and all fields have values
    if (total !== 100 && !Object.values(valueInputs).some(v => v.percentage === '')) {
      const factor = 100 / total;
      
      const normalized = {};
      Object.entries(valueInputs).forEach(([key, value]) => {
        normalized[key] = {
          ...value,
          percentage: Math.round(value.percentage * factor)
        };
      });
      
      // Adjust rounding errors in the last value
      const newTotal = Object.values(normalized).reduce((sum, value) => sum + value.percentage, 0);
      if (newTotal !== 100) {
        const diff = 100 - newTotal;
        const lastKey = Object.keys(normalized).pop();
        normalized[lastKey].percentage += diff;
      }
      
      setValueInputs(normalized);
    }
  }, [valueInputs]);

  // Calculate total value whenever inputs change
  useEffect(() => {
    const calculatedTotalValue = Object.values(valueInputs).reduce(
      (sum, value) => sum + (parseFloat(value.cost) || 0), 0
    );
    setTotalValue(calculatedTotalValue);
  }, [valueInputs]);
  
  // Calculate project price
  const calculatePrice = () => {
    const calculatedPrice = totalValue * valuePercentage;
    setProjectPrice(calculatedPrice);
    setActiveTab('pricing');
  };

  // Get currency symbol
  const getCurrencySymbol = () => {
    switch(currency) {
      case 'GBP': return '£';
      case 'EUR': return '€';
      case 'CAD': return 'C$';
      case 'USD': 
      default: return '$';
    }
  };

  // Format currency
  const formatCurrency = (value) => {
    const localeMap = {
      'USD': 'en-US',
      'GBP': 'en-GB',
      'CAD': 'en-CA',
      'EUR': 'en-EU'
    };
    
    return new Intl.NumberFormat(localeMap[currency] || 'en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };
  
  // Format percentage
  const formatPercentage = (value) => {
    return `${(value * 100).toFixed(0)}%`;
  };

  // Generate suggested values based on selected industry
  const suggestAllValues = () => {
    const distribution = industryDistributions[selectedIndustry];
    const baseValue = industryBaseValues[selectedIndustry];
    
    const newValues = {};
    Object.keys(valueInputs).forEach(key => {
      newValues[key] = {
        ...valueInputs[key],
        percentage: Math.round(distribution[key] * 100),
        cost: Math.round(distribution[key] * baseValue)
      };
    });
    
    setValueInputs(newValues);
  };

  // Get a human-readable label for a value type
  const getValueTypeLabel = (key) => {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  };

  // Determine the next step button text and action
  const getNextStepAction = () => {
    switch(activeTab) {
      case 'bam':
        return { text: 'Continue to Value Assessment', action: () => setActiveTab('value') };
      case 'value':
        return { text: 'Continue to Pricing', action: () => setActiveTab('pricing') };
      case 'pricing':
        return { text: 'Calculate Final Price', action: calculatePrice };
      default:
        return { text: 'Next Step', action: () => {} };
    }
  };

  // Get the color based on budget comparison
  const getBudgetComparisonColor = () => {
    if (!clientBudget) return 'text-gray-600';
    return clientBudget >= projectPrice ? 'text-[#29312D]' : 'text-[#BE957F]';
  };

  const nextStep = getNextStepAction();
  
  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card className="mb-6">
        <CardHeader className="bg-gradient-to-r from-[#BE957F] to-[#29312D] text-[#FCF9F5]">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl font-bold">Value-Based Project Pricing Calculator</CardTitle>
              <CardDescription className="text-[#F1EBE4]">Build better proposals with confidence in your pricing</CardDescription>
            </div>
            <div className="flex items-center bg-[#F1EBE4] text-[#29312D] px-3 py-2 rounded-md">
              <Globe className="w-4 h-4 mr-2" />
              <Select value={currency} onValueChange={(value) => setCurrency(value)}>
                <SelectTrigger className="w-24 border-0 bg-transparent p-0 h-auto shadow-none focus:ring-0">
                  <SelectValue placeholder="USD" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                  <SelectItem value="CAD">CAD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 rounded-none">
              <TabsTrigger value="bam" className="data-[state=active]:bg-[#F1EBE4] data-[state=active]:text-[#29312D]">
                <Briefcase className="w-4 h-4 mr-2" />
                BAM Rate
              </TabsTrigger>
              <TabsTrigger value="value" className="data-[state=active]:bg-[#F1EBE4] data-[state=active]:text-[#29312D]">
                <PieChart className="w-4 h-4 mr-2" />
                Value Assessment
              </TabsTrigger>
              <TabsTrigger value="pricing" className="data-[state=active]:bg-[#F1EBE4] data-[state=active]:text-[#29312D]">
                <DollarSign className="w-4 h-4 mr-2" />
                Project Pricing
              </TabsTrigger>
            </TabsList>

            {/* BAM Calculation Tab */}
            <TabsContent value="bam" className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Calculate Your Bare Minimum Hourly Rate</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    This is the absolute minimum hourly rate you need to cover your salary, expenses, and profit goals.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="monthlySalary">Monthly Desired Salary</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                      <Input
                        id="monthlySalary"
                        type="number"
                        name="monthlySalary"
                        value={bamInputs.monthlySalary}
                        onChange={handleBamInputChange}
                        className="pl-9"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="monthlyProfit">Monthly Profit Goal</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                      <Input
                        id="monthlyProfit"
                        type="number"
                        name="monthlyProfit"
                        value={bamInputs.monthlyProfit}
                        onChange={handleBamInputChange}
                        className="pl-9"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="monthlyExpenses">Monthly Business Expenses</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                      <Input
                        id="monthlyExpenses"
                        type="number"
                        name="monthlyExpenses"
                        value={bamInputs.monthlyExpenses}
                        onChange={handleBamInputChange}
                        className="pl-9"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="monthlyBillableHours">Monthly Billable Hours</Label>
                    <Input
                      id="monthlyBillableHours"
                      type="number"
                      name="monthlyBillableHours"
                      value={bamInputs.monthlyBillableHours}
                      onChange={handleBamInputChange}
                    />
                    <p className="text-xs text-gray-500">
                      Example: 25 hours/week × 4 weeks = 100 hours
                    </p>
                  </div>
                </div>

                <Card className="bg-[#FCF9F5] border-[#C8C8C0]">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium text-[#29312D]">Your Bare Minimum Hourly Rate:</h3>
                      <span className="text-2xl font-bold text-[#29312D]">
                        {formatCurrency(bam)}
                      </span>
                    </div>
                    <p className="text-xs text-[#BE957F] mt-1">
                      This is your absolute minimum hourly rate. Your project rates should be higher than this.
                    </p>
                  </CardContent>
                </Card>

                <div className="flex justify-end">
                  <Button onClick={nextStep.action} className="bg-[#BE957F] hover:bg-[#29312D] text-[#FCF9F5]">
                    {nextStep.text}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Value Assessment Tab */}
            <TabsContent value="value" className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Value Rankings and Estimation</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Adjust the percentages to indicate how much each value dimension contributes to your project.
                    Then, estimate the monetary value of each dimension to the client.
                  </p>
                  
                  <div className="mb-6 p-4 bg-[#FCF9F5] border border-[#C8C8C0] rounded-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-[#29312D] mb-2">How to Estimate Value?</h4>
                        <p className="text-sm text-gray-600">
                          Think about what each type of value is worth to your client, not what it costs you to deliver. 
                          Consider these approaches:
                        </p>
                        <ul className="mt-2 ml-6 list-disc text-sm text-gray-600 space-y-1">
                          <li><strong>Client's Budget:</strong> What percentage of their budget is this worth?</li>
                          <li><strong>ROI Approach:</strong> How much additional revenue or savings will this generate?</li>
                          <li><strong>Alternatives:</strong> What would it cost them to get this value elsewhere?</li>
                          <li><strong>Problem-Solution:</strong> What is it worth to solve their problem?</li>
                        </ul>
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="mb-2">
                          <Label htmlFor="industry" className="text-sm font-medium mb-1 block">Client's Industry</Label>
                          <Select id="industry" value={selectedIndustry} onValueChange={(value) => setSelectedIndustry(value)}>
                            <SelectTrigger className="w-36">
                              <SelectValue placeholder="Select Industry" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="general">General</SelectItem>
                              <SelectItem value="tech">Technology</SelectItem>
                              <SelectItem value="finance">Finance</SelectItem>
                              <SelectItem value="healthcare">Healthcare</SelectItem>
                              <SelectItem value="ecommerce">E-commerce</SelectItem>
                              <SelectItem value="marketing">Marketing</SelectItem>
                              <SelectItem value="education">Education</SelectItem>
                              <SelectItem value="nonprofit">Non-profit</SelectItem>
                              <SelectItem value="construction">Construction</SelectItem>
                              <SelectItem value="manufacturing">Manufacturing</SelectItem>
                              <SelectItem value="creative">Creative</SelectItem>
                              <SelectItem value="legal">Legal</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button 
                          onClick={suggestAllValues}
                          className="bg-[#BE957F] hover:bg-[#29312D] text-[#FCF9F5] whitespace-nowrap"
                        >
                          Auto-Generate Values
                        </Button>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-[#C8C8C0] text-xs text-gray-600 italic">
                      Select your <strong>client's industry</strong> for more accurate value estimates, then click "Auto-Generate Values."
                    </div>
                  </div>
                </div>

                {Object.entries(valueInputs).map(([key, value]) => (
                  <Card key={key} className="p-4 border">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium text-gray-800">{getValueTypeLabel(key)}</h4>
                        <span className="text-sm font-semibold bg-[#F1EBE4] text-[#29312D] px-2 py-1 rounded-full">
                          {value.percentage}%
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Slider 
                            defaultValue={[value.percentage]} 
                            max={100}
                            step={1}
                            value={[value.percentage]}
                            onValueChange={(val) => handleValuePercentageChange(key, val[0])}
                            className="flex-grow"
                          />
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={value.percentage}
                            onChange={(e) => handleValuePercentageChange(key, parseInt(e.target.value) || 0)}
                            className="w-16"
                          />
                        </div>
                        <p className="text-xs text-gray-500">{value.description}</p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`${key}-cost`}>Value Estimation for {getValueTypeLabel(key)}</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                          <Input
                            id={`${key}-cost`}
                            type="number"
                            value={value.cost}
                            onChange={(e) => handleValueCostChange(key, e.target.value)}
                            className="pl-9"
                            placeholder="0"
                          />
                        </div>
                        <div className="p-3 bg-[#F1EBE4] rounded-md text-xs text-[#29312D]">
                          <div className="mb-2">
                            <strong>Examples for {getValueTypeLabel(key)}:</strong>
                            <ul className="mt-1 ml-4 list-disc">
                              {value.examples.map((example, idx) => (
                                <li key={idx}>{example}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="flex items-center gap-2 mt-3 border-t border-[#C8C8C0] pt-2">
                            <Button
                              onClick={() => {
                                // Pre-filled value suggestions based on category
                                const suggestions = {
                                  quantitativeValue: 28000,
                                  qualitativeValue: 15000,
                                  emotionalValue: 12000,
                                  strategicValue: 30000,
                                  aestheticValue: 18000
                                };
                                handleValueCostChange(key, suggestions[key] || 15000);
                              }}
                              className="text-xs py-1 h-auto bg-[#BE957F] hover:bg-[#29312D] text-[#FCF9F5]"
                            >
                              Suggest Value
                            </Button>
                            <span className="text-xs italic">Click for a typical value estimate</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="bg-[#FCF9F5] border-[#C8C8C0]">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium text-[#29312D]">Total Percentage:</h3>
                        <span className="text-2xl font-bold text-[#29312D]">
                          {Object.values(valueInputs).reduce((sum, value) => sum + value.percentage, 0)}%
                        </span>
                      </div>
                      <p className="text-xs text-[#BE957F] mt-1">
                        The total should equal 100%. Adjust sliders as needed.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-[#FCF9F5] border-[#C8C8C0]">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium text-[#29312D]">Total Value:</h3>
                        <span className="text-2xl font-bold text-[#29312D]">
                          {formatCurrency(totalValue)}
                        </span>
                      </div>
                      <p className="text-xs text-[#BE957F] mt-1">
                        This is the total value you're providing to the client.
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex justify-end">
                  <Button onClick={nextStep.action} className="bg-[#BE957F] hover:bg-[#29312D] text-[#FCF9F5]">
                    {nextStep.text}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Project Pricing Tab */}
            <TabsContent value="pricing" className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Calculate Your Project Price</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Choose what percentage of the total value you want to charge. The industry standard is 12-25% of the total value.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-3">
                    <Label htmlFor="clientBudget">Client's Budget (Optional)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                      <Input
                        id="clientBudget"
                        type="number"
                        value={clientBudget}
                        onChange={handleBudgetChange}
                        className="pl-9"
                        placeholder="0"
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      This helps gauge if your pricing aligns with client expectations.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="valuePercentage">Percentage of Value to Charge</Label>
                      <span className="text-sm font-semibold bg-[#F1EBE4] text-[#29312D] px-2 py-1 rounded-full">
                        {formatPercentage(valuePercentage)}
                      </span>
                    </div>
                    <Slider
                      id="valuePercentage"
                      defaultValue={[valuePercentage]}
                      min={0.12}
                      max={0.25}
                      step={0.01}
                      value={[valuePercentage]}
                      onValueChange={handlePercentageChange}
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>12%</span>
                      <span>15%</span>
                      <span>20%</span>
                      <span>25%</span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Lower percentages for larger value projects, higher percentages for smaller value projects.
                    </p>
                  </div>
                </div>

                <Button
                  onClick={calculatePrice}
                  className="w-full py-6 bg-[#BE957F] hover:bg-[#29312D] text-[#FCF9F5] text-lg"
                >
                  Calculate Project Price
                </Button>

                {projectPrice > 0 && (
                  <div className="space-y-6">
                    <Card className="bg-[#FCF9F5] border-[#C8C8C0]">
                      <CardContent className="p-6">
                        <div className="text-center mb-3">
                          <h3 className="font-semibold text-[#29312D] text-lg">Recommended Project Price</h3>
                          <p className="text-5xl font-bold text-[#29312D] my-4">
                            {formatCurrency(projectPrice)}
                          </p>
                          <div className="flex items-center justify-center gap-2 text-sm text-[#BE957F]">
                            <span>{formatCurrency(totalValue)}</span>
                            <span>×</span>
                            <span className="bg-[#F1EBE4] px-2 py-1 rounded-full flex items-center text-[#29312D]">
                              <Percent className="h-3 w-3 mr-1" />
                              {formatPercentage(valuePercentage)}
                            </span>
                          </div>
                        </div>

                        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-[#F1EBE4] p-3 rounded-md">
                            <h4 className="text-sm font-medium text-[#29312D] mb-1">Your BAM Rate</h4>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-[#BE957F]">Bare Minimum Hourly Rate</span>
                              <span className="text-lg font-bold text-[#29312D]">{formatCurrency(bam)}/hr</span>
                            </div>
                          </div>
                          
                          <div className="bg-[#F1EBE4] p-3 rounded-md">
                            <h4 className="text-sm font-medium text-[#29312D] mb-1">Effective Project Rate</h4>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-[#BE957F]">Based on 20-40 hours of work</span>
                              <span className="text-lg font-bold text-[#29312D]">
                                {formatCurrency(projectPrice / 30)}/hr
                                <span className="text-xs ml-1 text-green-600">
                                  {bam < (projectPrice / 30) ? `(${Math.round(((projectPrice / 30) / bam - 1) * 100)}% above BAM)` : ''}
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>

                        {clientBudget && (
                          <div className={`text-sm border-t border-[#C8C8C0] pt-3 mt-4 ${getBudgetComparisonColor()}`}>
                            <div className="flex items-center gap-2 justify-center">
                              {clientBudget >= projectPrice ? (
                                <>
                                  <Check className="h-4 w-4" />
                                  <p>Your price is within the client's budget of {formatCurrency(clientBudget)}!</p>
                                </>
                              ) : (
                                <p>Your price is {formatCurrency(projectPrice - clientBudget)} above the client's budget of {formatCurrency(clientBudget)}.</p>
                              )}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <div>
                      <h3 className="text-lg font-semibold mb-4">Pricing Options</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="overflow-hidden">
                          <CardHeader className="bg-gray-100 p-4 text-center">
                            <CardTitle>Basic Package</CardTitle>
                            <p className="text-2xl font-bold text-gray-800 mt-2">
                              {formatCurrency(projectPrice * 0.8)}
                            </p>
                          </CardHeader>
                          <CardContent className="p-4">
                            <p className="mb-2 text-sm">Core deliverables only.</p>
                            <p className="text-gray-500 text-xs">
                              Good for clients with limited budgets who only need the essentials.
                            </p>
                          </CardContent>
                        </Card>

                        <Card className="border-2 border-[#BE957F] overflow-hidden shadow-md">
                          <CardHeader className="bg-[#F1EBE4] p-4 text-center relative">
                            <div className="bg-[#BE957F] text-[#FCF9F5] py-1 px-3 rounded-full text-xs font-semibold absolute top-2 right-2">RECOMMENDED</div>
                            <CardTitle>Standard Package</CardTitle>
                            <p className="text-2xl font-bold text-[#29312D] mt-2">
                              {formatCurrency(projectPrice)}
                            </p>
                          </CardHeader>
                          <CardContent className="p-4">
                            <p className="mb-2 text-sm">Complete solution with all core value elements.</p>
                            <p className="text-gray-500 text-xs">
                              The optimal balance of value and investment for most clients.
                            </p>
                          </CardContent>
                        </Card>

                        <Card className="overflow-hidden">
                          <CardHeader className="bg-gray-100 p-4 text-center">
                            <CardTitle>Premium Package</CardTitle>
                            <p className="text-2xl font-bold text-gray-800 mt-2">
                              {formatCurrency(projectPrice * 1.25)}
                            </p>
                          </CardHeader>
                          <CardContent className="p-4">
                            <p className="mb-2 text-sm">Everything in Standard plus premium add-ons.</p>
                            <p className="text-gray-500 text-xs">
                              For clients who want the most comprehensive solution.
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                    
                    <Card className="overflow-hidden">
                      <CardHeader className="bg-[#BE957F] p-4 text-[#FCF9F5]">
                        <CardTitle className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 10-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                          </svg>
                          Monthly Retainer Options
                        </CardTitle>
                        <CardDescription className="text-[#F1EBE4]">
                          Convert your project price into ongoing monthly retainers
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="grid grid-cols-1 md:grid-cols-3 divide-x divide-y md:divide-y-0 divide-[#C8C8C0]">
                          <div className="p-4">
                            <h4 className="font-medium text-[#29312D] mb-2">3-Month Retainer</h4>
                            <p className="text-2xl font-bold text-[#29312D] mb-2">
                              {formatCurrency(projectPrice / 2.5 / 3)}
                              <span className="text-xs font-normal text-[#BE957F] ml-1">per month</span>
                            </p>
                            <div className="text-xs text-gray-600 space-y-1">
                              <p>• Short-term commitment</p>
                              <p>• Higher monthly rate</p>
                              <p>• Total: {formatCurrency(projectPrice / 2.5)}</p>
                              <p className="text-[#BE957F] italic mt-2">Best for testing the relationship</p>
                            </div>
                          </div>
                          
                          <div className="p-4 bg-[#FCF9F5]">
                            <h4 className="font-medium text-[#29312D] mb-2">6-Month Retainer</h4>
                            <p className="text-2xl font-bold text-[#29312D] mb-2">
                              {formatCurrency(projectPrice / 3 / 6)}
                              <span className="text-xs font-normal text-[#BE957F] ml-1">per month</span>
                            </p>
                            <div className="text-xs text-gray-600 space-y-1">
                              <p>• Medium-term commitment</p>
                              <p>• Balanced monthly rate</p>
                              <p>• Total: {formatCurrency(projectPrice / 3 * 6)}</p>
                              <p className="text-[#BE957F] italic mt-2">Best for ongoing projects with predictable needs</p>
                            </div>
                          </div>
                          
                          <div className="p-4">
                            <h4 className="font-medium text-[#29312D] mb-2">12-Month Retainer</h4>
                            <p className="text-2xl font-bold text-[#29312D] mb-2">
                              {formatCurrency(projectPrice / 4 / 12)}
                              <span className="text-xs font-normal text-[#BE957F] ml-1">per month</span>
                            </p>
                            <div className="text-xs text-gray-600 space-y-1">
                              <p>• Long-term commitment</p>
                              <p>• Lowest monthly rate</p>
                              <p>• Total: {formatCurrency(projectPrice / 4 * 12)}</p>
                              <p className="text-[#BE957F] italic mt-2">Best for strategic partnerships and consistent support</p>
                            </div>
                          </div>
                        </div>
                        <div className="p-3 bg-[#F1EBE4] text-xs text-[#29312D]">
                          <p>Retainer pricing ensures consistent value delivery over time. Consider including monthly reporting, regular check-ins, and support in your retainer package.</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ValuePricingCalculator;