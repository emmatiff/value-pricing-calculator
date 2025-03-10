// Access Lucide icons
const { DollarSign, PieChart, Percent, Briefcase, Globe, ArrowRight, Check } = window.LucideReact;

const ValuePricingCalculator = () => {
  // State for BAM calculation
  const [bamInputs, setBamInputs] = React.useState({
    monthlySalary: 5000,
    monthlyProfit: 1667,
    monthlyExpenses: 1250,
    monthlyBillableHours: 100, // Default: 25 hours/week, 4 weeks/month
  });

  // State for value assessment
  const [valueInputs, setValueInputs] = React.useState({
    quantitativeValue: { percentage: 20, description: "How will this impact measurable metrics? Revenue, time savings, efficiency gains, etc.", cost: 2000 },
    qualitativeValue: { percentage: 20, description: "What intangible benefits will the client receive? Status, positioning, reputation, etc.", cost: 2000 },
    emotionalValue: { percentage: 20, description: "How will this make the client feel? What pain points will it resolve? Peace of mind?", cost: 2000 },
    strategicValue: { percentage: 20, description: "How does this contribute to long-term goals? Competitive advantage? Market position?", cost: 2000 },
    aestheticValue: { percentage: 20, description: "How does the experience feel? Visual appeal? User experience? Brand impression?", cost: 2000 },
  });

  // State for client budget and value multiplier
  const [clientBudget, setClientBudget] = React.useState('');
  const [valuePercentage, setValuePercentage] = React.useState(0.18); // Default 18% (middle of 12-25% range)
  
  // Calculated results
  const [bam, setBam] = React.useState(0);
  const [totalValue, setTotalValue] = React.useState(0);
  const [projectPrice, setProjectPrice] = React.useState(0);
  
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
  const handlePercentageChange = (e) => {
    setValuePercentage(parseFloat(e.target.value));
  };
  
  // Calculate BAM whenever inputs change
  React.useEffect(() => {
    if (bamInputs.monthlyBillableHours > 0) {
      const totalMonthlyIncome = bamInputs.monthlySalary + bamInputs.monthlyProfit + bamInputs.monthlyExpenses;
      const calculatedBam = totalMonthlyIncome / bamInputs.monthlyBillableHours;
      setBam(calculatedBam);
    }
  }, [bamInputs]);
  
  // Ensure value percentages total to 100%
  React.useEffect(() => {
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
  
  // Calculate project price when inputs change
  const calculatePrice = () => {
    // Calculate total value from all value components
    const totalCost = Object.values(valueInputs).reduce(
      (sum, value) => sum + (parseFloat(value.cost) || 0), 0
    );
    
    // Calculate value-based price using the percentage of total value
    const calculatedPrice = totalCost * valuePercentage;
    
    setTotalValue(totalCost);
    setProjectPrice(calculatedPrice);
  };
  
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-6">Value-Based Project Pricing Calculator</h1>
      
      {/* BAM Calculation Section */}
      <div className="mb-8 p-4 border rounded-lg bg-gray-50">
        <h2 className="text-lg font-semibold mb-4">1. Calculate Your Bare Minimum Hourly Rate (BAM)</h2>
        <p className="text-sm text-gray-600 mb-4">
          This is the absolute minimum hourly rate you need to cover your salary, expenses, and profit goals.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Monthly Desired Salary ($)
            </label>
            <input
              type="number"
              name="monthlySalary"
              value={bamInputs.monthlySalary}
              onChange={handleBamInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Monthly Profit Goal ($)
            </label>
            <input
              type="number"
              name="monthlyProfit"
              value={bamInputs.monthlyProfit}
              onChange={handleBamInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Monthly Business Expenses ($)
            </label>
            <input
              type="number"
              name="monthlyExpenses"
              value={bamInputs.monthlyExpenses}
              onChange={handleBamInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Monthly Billable Hours
            </label>
            <input
              type="number"
              name="monthlyBillableHours"
              value={bamInputs.monthlyBillableHours}
              onChange={handleBamInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <p className="text-xs text-gray-500 mt-1">
              Example: 25 hours/week × 4 weeks = 100 hours
            </p>
          </div>
        </div>
        
        <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-blue-800">Your Bare Minimum Hourly Rate:</h3>
            <span className="text-2xl font-bold text-blue-800">
              ${bam.toFixed(2)}
            </span>
          </div>
          <p className="text-xs text-blue-600 mt-1">
            This is your absolute minimum hourly rate. Your project rates should be higher than this.
          </p>
        </div>
      </div>
      
      {/* Value Assessment Section */}
      <div className="mb-8 p-4 border rounded-lg bg-gray-50">
        <h2 className="text-lg font-semibold mb-4">2. Value Rankings and Cost Per Value</h2>
        <p className="text-sm text-gray-600 mb-4">
          Adjust the percentages to indicate how much each value dimension contributes to your project. 
          The total must equal 100%. Then, set a cost for each value dimension.
        </p>
        
        {Object.entries(valueInputs).map(([key, value]) => (
          <div key={key} className="mb-6 border-b pb-4">
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-medium text-gray-700">
                {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
              </label>
              <span className="text-sm font-semibold">{value.percentage}%</span>
            </div>
            <div className="flex items-center space-x-2 mb-3">
              <input
                type="range"
                min="0"
                max="100"
                value={value.percentage}
                onChange={(e) => handleValuePercentageChange(key, parseInt(e.target.value))}
                className="w-full"
              />
              <input
                type="number"
                min="0"
                max="100"
                value={value.percentage}
                onChange={(e) => handleValuePercentageChange(key, parseInt(e.target.value) || 0)}
                className="w-16 p-1 border border-gray-300 rounded-md"
              />
            </div>
            <p className="text-xs text-gray-500 mb-3">{value.description}</p>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cost for this Value Dimension ($)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  value={value.cost}
                  onChange={(e) => handleValueCostChange(key, e.target.value)}
                  className="w-full p-2 pl-7 border border-gray-300 rounded-md"
                  placeholder="0.00"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Enter the specific cost associated with delivering this value dimension to the client.
              </p>
            </div>
          </div>
        ))}
        
        <div className="bg-green-50 p-3 rounded-md border border-green-200 mb-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-green-800">Total Percentage:</h3>
            <span className="text-2xl font-bold text-green-800">
              {Object.values(valueInputs).reduce((sum, value) => sum + value.percentage, 0)}%
            </span>
          </div>
          <p className="text-xs text-green-600 mt-1">
            The total should equal 100%. Adjust sliders as needed to represent the value distribution.
          </p>
        </div>
        
        <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-blue-800">Total Value:</h3>
            <span className="text-2xl font-bold text-blue-800">
              ${Object.values(valueInputs).reduce((sum, value) => sum + (parseFloat(value.cost) || 0), 0).toLocaleString()}
            </span>
          </div>
          <p className="text-xs text-blue-600 mt-1">
            This is the total value you're providing to the client across all dimensions.
          </p>
        </div>
      </div>
      
      {/* Project Pricing Section */}
      <div className="mb-8 p-4 border rounded-lg bg-gray-50">
        <h2 className="text-lg font-semibold mb-4">3. Calculate Your Project Price</h2>
        <p className="text-sm text-gray-600 mb-4">
          Choose what percentage of the total value you want to charge. The industry standard is 12-25% of the total value.
        </p>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Client's Budget (Optional)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              value={clientBudget}
              onChange={handleBudgetChange}
              className="w-full p-2 pl-7 border border-gray-300 rounded-md"
              placeholder="0.00"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            This helps gauge if your pricing aligns with client expectations.
          </p>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Percentage of Value to Charge: {(valuePercentage * 100).toFixed(0)}%
          </label>
          <input
            type="range"
            min="0.12"
            max="0.25"
            step="0.01"
            value={valuePercentage}
            onChange={handlePercentageChange}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>12%</span>
            <span>15%</span>
            <span>20%</span>
            <span>25%</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Lower percentages are appropriate for larger value projects, higher percentages for smaller value projects.
          </p>
        </div>
        
        <button
          onClick={calculatePrice}
          className="w-full py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 mb-4"
        >
          Calculate Project Price
        </button>
        
        {projectPrice > 0 && (
          <div className="bg-indigo-50 p-4 rounded-md border border-indigo-200">
            <div className="text-center mb-3">
              <h3 className="font-semibold text-indigo-800 text-lg">Recommended Project Price</h3>
              <p className="text-4xl font-bold text-indigo-800 my-2">
                ${projectPrice.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}
              </p>
              <p className="text-sm text-indigo-600">
                Based on ${totalValue.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})} total value × {(valuePercentage * 100).toFixed(0)}%
              </p>
            </div>
            
            {clientBudget && (
              <div className="text-sm text-indigo-600 border-t border-indigo-200 pt-3 mt-3">
                <p>
                  {clientBudget >= projectPrice 
                    ? `Your price is within the client's budget! They expected to pay $${clientBudget.toLocaleString()}.` 
                    : `Your price is $${(projectPrice - clientBudget).toLocaleString()} above the client's budget of $${clientBudget.toLocaleString()}.`}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Pricing Tiers (Optional) */}
      {projectPrice > 0 && (
        <div className="mb-8 p-4 border rounded-lg bg-gray-50">
          <h2 className="text-lg font-semibold mb-4">4. Suggested Pricing Packages</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-gray-100 p-4 text-center">
                <h3 className="text-lg font-medium">Basic Package</h3>
                <p className="text-2xl font-bold text-gray-800 my-2">
                  ${Math.round(projectPrice * 0.8).toLocaleString()}
                </p>
              </div>
              <div className="p-4 text-sm">
                <p className="mb-2">Core deliverables only.</p>
                <p className="text-gray-500 text-xs">
                  Good for clients with limited budgets who only need the essentials.
                </p>
              </div>
            </div>
            
            <div className="border-2 border-indigo-500 rounded-lg overflow-hidden shadow-md">
              <div className="bg-indigo-50 p-4 text-center relative">
                <div className="bg-indigo-500 text-white py-1 px-3 rounded-full text-xs font-semibold absolute top-2 right-2">RECOMMENDED</div>
                <h3 className="text-lg font-medium">Standard Package</h3>
                <p className="text-2xl font-bold text-indigo-700 my-2">
                  ${Math.round(projectPrice).toLocaleString()}
                </p>
              </div>
              <div className="p-4 text-sm">
                <p className="mb-2">Complete solution with all core value elements.</p>
                <p className="text-gray-500 text-xs">
                  The optimal balance of value and investment for most clients.
                </p>
              </div>
            </div>
            
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-gray-100 p-4 text-center">
                <h3 className="text-lg font-medium">Premium Package</h3>
                <p className="text-2xl font-bold text-gray-800 my-2">
                  ${Math.round(projectPrice * 1.25).toLocaleString()}
                </p>
              </div>
              <div className="p-4 text-sm">
                <p className="mb-2">Everything in Standard plus premium add-ons.</p>
                <p className="text-gray-500 text-xs">
                  For clients who want the most comprehensive solution.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Render the calculator
const rootElement = document.getElementById('root');
ReactDOM.createRoot(rootElement).render(<ValuePricingCalculator />);
