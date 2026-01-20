import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Lock, CheckCircle, ChevronLeft, Smartphone, ArrowRight, 
  Building2, RefreshCw, Eye, BellRing, MapPin, User, Target, 
  GraduationCap, Briefcase, Laptop, Wallet, TrendingUp, Languages
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { FinEdLogo } from '@/components/FinEdLogo';

interface DiscoveryFlowProps {
  onComplete: (data: DiscoveryData) => void;
}

export interface DiscoveryData {
  fullName: string;
  city: string;
  personaId: 'priya' | 'arjun';
  monthlyIncome: number;
  financialGoal: string;
  bankLinked: boolean;
  smsEnabled: boolean;
}

const TIER_2_3_CITIES = [
  'Indore', 'Coimbatore', 'Jaipur', 'Lucknow', 'Nagpur', 'Visakhapatnam',
  'Bhopal', 'Patna', 'Vadodara', 'Ludhiana', 'Agra', 'Nashik', 'Faridabad',
  'Meerut', 'Rajkot', 'Varanasi', 'Srinagar', 'Aurangabad', 'Amritsar',
  'Jodhpur', 'Raipur', 'Kota', 'Guwahati', 'Chandigarh', 'Thiruvananthapuram'
];

const INDIAN_BANKS = [
  { id: 'sbi', name: 'State Bank of India', short: 'SBI' },
  { id: 'hdfc', name: 'HDFC Bank', short: 'HDFC' },
  { id: 'icici', name: 'ICICI Bank', short: 'ICICI' },
  { id: 'axis', name: 'Axis Bank', short: 'AXIS' },
  { id: 'kotak', name: 'Kotak Mahindra Bank', short: 'KOTAK' },
  { id: 'pnb', name: 'Punjab National Bank', short: 'PNB' },
  { id: 'bob', name: 'Bank of Baroda', short: 'BOB' },
  { id: 'canara', name: 'Canara Bank', short: 'CANARA' },
  { id: 'union', name: 'Union Bank of India', short: 'UNION' },
  { id: 'idbi', name: 'IDBI Bank', short: 'IDBI' },
  { id: 'indusind', name: 'IndusInd Bank', short: 'INDUSIND' },
  { id: 'yes', name: 'Yes Bank', short: 'YES' },
];

const FINANCIAL_GOALS = {
  priya: [
    { id: 'laptop', icon: Laptop, label: 'Save for a Laptop', sublabel: '₹30,000 - ₹50,000' },
    { id: 'course', icon: GraduationCap, label: 'Fund a Course/Certification', sublabel: '₹10,000 - ₹25,000' },
    { id: 'emergency', icon: Wallet, label: 'Build Emergency Fund', sublabel: '3 months of expenses' },
  ],
  arjun: [
    { id: 'emergency', icon: Wallet, label: 'Build an Emergency Fund', sublabel: '3-6 months of expenses' },
    { id: 'sip', icon: TrendingUp, label: 'Start my first SIP/Investment', sublabel: 'Mutual funds, stocks' },
    { id: 'laptop', icon: Laptop, label: 'Save for a Gadget Upgrade', sublabel: '₹50,000 - ₹1,00,000' },
  ],
};

const LABELS = {
  en: {
    fullName: 'Full Name',
    namePlaceholder: 'Enter your name',
    currentCity: 'Current City',
    cityPlaceholder: 'Search your city...',
    iAmA: 'I am a...',
    student: 'Student',
    studentDesc: 'I am in college with a monthly budget of ₹2k - ₹5k',
    professional: 'Young Professional',
    professionalDesc: 'I am working/interning with an income of ₹15k - ₹35k',
    monthlyIncome: 'What is your total monthly income/allowance?',
    primaryGoal: 'What is your primary financial goal for the next 6 months?',
    connectWorld: 'Connect Your World',
    connectDesc: 'Link your bank for automated expense tracking',
    smsAccess: 'SMS Access',
    smsDesc: 'Track UPI transactions in real-time',
    continue: 'Continue',
    skip: 'Skip for now',
    linkBank: 'Link Bank Account',
    allowSms: 'Allow SMS Access',
    step: 'Step',
    of: 'of',
  },
  hi: {
    fullName: 'Aapka Naam',
    namePlaceholder: 'Apna naam likhein',
    currentCity: 'Aapka Sheher',
    cityPlaceholder: 'Sheher khojein...',
    iAmA: 'Main hoon...',
    student: 'Student',
    studentDesc: 'College mein hoon, monthly budget ₹2k - ₹5k',
    professional: 'Young Professional',
    professionalDesc: 'Kaam kar raha/rahi hoon, income ₹15k - ₹35k',
    monthlyIncome: 'Aapki total monthly income/allowance kitni hai?',
    primaryGoal: 'Agle 6 mahine ka primary financial goal kya hai?',
    connectWorld: 'Apni Duniya Connect Karein',
    connectDesc: 'Automatic expense tracking ke liye bank link karein',
    smsAccess: 'SMS Access',
    smsDesc: 'Real-time UPI transactions track karein',
    continue: 'Aage Badhein',
    skip: 'Abhi nahi',
    linkBank: 'Bank Link Karein',
    allowSms: 'SMS Access Dein',
    step: 'Step',
    of: 'mein se',
  },
};

export function DiscoveryFlow({ onComplete }: DiscoveryFlowProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isHinglish, setIsHinglish] = useState(false);
  const [formData, setFormData] = useState<Partial<DiscoveryData>>({
    fullName: '',
    city: '',
    personaId: undefined,
    monthlyIncome: 0,
    financialGoal: '',
    bankLinked: false,
    smsEnabled: false,
  });
  
  // City autocomplete state
  const [citySearch, setCitySearch] = useState('');
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const filteredCities = TIER_2_3_CITIES.filter(city => 
    city.toLowerCase().includes(citySearch.toLowerCase())
  ).slice(0, 5);
  
  // Bank linking state
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [showConsent, setShowConsent] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchProgress, setFetchProgress] = useState(0);
  
  // SMS permission state
  const [smsGranted, setSmsGranted] = useState(false);
  const [showParsedSms, setShowParsedSms] = useState(false);

  const labels = isHinglish ? LABELS.hi : LABELS.en;
  
  const pageVariants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
  };

  const canProceedStep1 = formData.fullName && formData.city && formData.personaId;
  const canProceedStep2 = formData.monthlyIncome && formData.monthlyIncome > 0 && formData.financialGoal;

  const handlePersonaSelect = (personaId: 'priya' | 'arjun') => {
    // Pre-set default income based on persona
    const defaultIncome = personaId === 'priya' ? 3500 : 25000;
    setFormData(prev => ({ 
      ...prev, 
      personaId,
      monthlyIncome: defaultIncome,
    }));
  };

  const handleBankSelect = (bankId: string) => {
    setSelectedBank(bankId);
    setShowConsent(true);
  };

  const handleLinkBank = () => {
    if (!selectedBank) return;
    setIsFetching(true);
    setFetchProgress(0);
    
    const interval = setInterval(() => {
      setFetchProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsFetching(false);
            setFormData(prev => ({ ...prev, bankLinked: true }));
            setCurrentStep(4);
          }, 300);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 200);
  };

  const handleSmsPermission = () => {
    setSmsGranted(true);
    setTimeout(() => {
      setShowParsedSms(true);
    }, 800);
    setTimeout(() => {
      setFormData(prev => ({ ...prev, smsEnabled: true }));
      handleComplete();
    }, 2500);
  };

  const handleComplete = () => {
    onComplete(formData as DiscoveryData);
  };

  const SecurityBadge = ({ text, icon: Icon }: { text: string; icon: any }) => (
    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-success/10 text-success text-xs font-medium">
      <Icon className="w-3.5 h-3.5" />
      <span>{text}</span>
    </div>
  );

  const Tooltip = ({ text }: { text: string }) => (
    <span className="text-[10px] text-muted-foreground/70 flex items-center gap-1">
      <Lock className="w-3 h-3" />
      {text}
    </span>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Progress Header */}
      <div className="p-4 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-2">
            {currentStep > 1 && (
              <button 
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            
            {/* Language Toggle */}
            <button
              onClick={() => setIsHinglish(!isHinglish)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted hover:bg-muted/80 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors ml-auto"
            >
              <Languages className="w-3.5 h-3.5" />
              <span>{isHinglish ? 'English' : 'हिंग्लिश'}</span>
            </button>
          </div>
          
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              {labels.step} {currentStep} {labels.of} 4
            </span>
          </div>
          <Progress value={(currentStep / 4) * 100} className="h-1.5" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-start justify-center px-6 py-8 overflow-y-auto">
        <AnimatePresence mode="wait">
          {/* Step 1: Basic Identity & Persona Selection */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="max-w-md w-full"
            >
              {/* Logo */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center mb-6"
              >
                <FinEdLogo size="md" showTagline={false} animate />
                <p className="text-sm text-muted-foreground mt-3">Let's get to know you</p>
              </motion.div>

              {/* Form Fields */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-4 mb-6"
              >
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    {labels.fullName}
                  </label>
                  <Input
                    type="text"
                    placeholder={labels.namePlaceholder}
                    value={formData.fullName}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                    className="w-full py-3 px-4 rounded-xl"
                  />
                </div>

                {/* City with Autocomplete */}
                <div className="relative">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    {labels.currentCity}
                  </label>
                  <Input
                    type="text"
                    placeholder={labels.cityPlaceholder}
                    value={citySearch || formData.city}
                    onChange={(e) => {
                      setCitySearch(e.target.value);
                      setShowCitySuggestions(true);
                    }}
                    onFocus={() => setShowCitySuggestions(true)}
                    className="w-full py-3 px-4 rounded-xl"
                  />
                  {showCitySuggestions && citySearch && filteredCities.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute z-10 w-full mt-1 bg-card border border-border rounded-xl shadow-lg overflow-hidden"
                    >
                      {filteredCities.map((city) => (
                        <button
                          key={city}
                          onClick={() => {
                            setFormData(prev => ({ ...prev, city }));
                            setCitySearch('');
                            setShowCitySuggestions(false);
                          }}
                          className="w-full px-4 py-3 text-left text-sm hover:bg-muted transition-colors flex items-center gap-2"
                        >
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          {city}
                        </button>
                      ))}
                    </motion.div>
                  )}
                  {formData.city && !citySearch && (
                    <p className="text-xs text-success mt-1 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      {formData.city} selected
                    </p>
                  )}
                </div>
              </motion.div>

              {/* Persona Selection */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-6"
              >
                <p className="text-sm font-medium text-foreground mb-4 text-center">
                  {labels.iAmA}
                </p>
                <div className="space-y-3">
                  {/* Student Card */}
                  <button
                    onClick={() => handlePersonaSelect('priya')}
                    className={`w-full p-4 rounded-2xl border-2 transition-all duration-200 text-left flex items-start gap-4 ${
                      formData.personaId === 'priya'
                        ? 'border-primary bg-primary/10'
                        : 'border-border bg-card hover:border-primary/50'
                    }`}
                  >
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-secondary/20 to-secondary/10 flex items-center justify-center shrink-0">
                      <GraduationCap className="w-7 h-7 text-secondary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">{labels.student}</h3>
                      <p className="text-sm text-muted-foreground">{labels.studentDesc}</p>
                      {formData.personaId === 'priya' && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-xs text-primary mt-2"
                        >
                          ✓ Budget Rule: 60/25/15 (Needs/Wants/Savings)
                        </motion.p>
                      )}
                    </div>
                  </button>

                  {/* Professional Card */}
                  <button
                    onClick={() => handlePersonaSelect('arjun')}
                    className={`w-full p-4 rounded-2xl border-2 transition-all duration-200 text-left flex items-start gap-4 ${
                      formData.personaId === 'arjun'
                        ? 'border-primary bg-primary/10'
                        : 'border-border bg-card hover:border-primary/50'
                    }`}
                  >
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center shrink-0">
                      <Briefcase className="w-7 h-7 text-accent" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">{labels.professional}</h3>
                      <p className="text-sm text-muted-foreground">{labels.professionalDesc}</p>
                      {formData.personaId === 'arjun' && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-xs text-primary mt-2"
                        >
                          ✓ Budget Rule: 50/30/20 (Needs/Wants/Savings)
                        </motion.p>
                      )}
                    </div>
                  </button>
                </div>
              </motion.div>

              {/* CTA */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                onClick={() => setCurrentStep(2)}
                disabled={!canProceedStep1}
                className={`w-full py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                  canProceedStep1
                    ? 'bg-gradient-primary text-white hover:shadow-glow hover:scale-[1.02] active:scale-[0.98]'
                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                }`}
              >
                <span>{labels.continue}</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-4 flex justify-center"
              >
                <Tooltip text="Your data is encrypted & secure" />
              </motion.div>
            </motion.div>
          )}

          {/* Step 2: Financial Health Baseline */}
          {currentStep === 2 && formData.personaId && (
            <motion.div
              key="step2"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="max-w-md w-full"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center mb-6"
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-secondary/10 flex items-center justify-center">
                  <Target className="w-7 h-7 text-secondary" />
                </div>
                <h2 className="text-xl font-bold text-foreground mb-2">Financial Health Check</h2>
                <p className="text-sm text-muted-foreground">
                  Help us understand your current financial situation
                </p>
              </motion.div>

              {/* Monthly Income */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-6"
              >
                <label className="block text-sm font-medium text-foreground mb-3">
                  {labels.monthlyIncome}
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-medium text-muted-foreground">₹</span>
                  <Input
                    type="number"
                    placeholder="25000"
                    value={formData.monthlyIncome || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, monthlyIncome: parseInt(e.target.value) || 0 }))}
                    className="w-full py-4 pl-10 pr-4 rounded-xl text-lg"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {formData.personaId === 'priya' 
                    ? 'Include pocket money, part-time income, freelance work'
                    : 'Include salary, freelance income, side hustles'
                  }
                </p>
              </motion.div>

              {/* Financial Goals */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-6"
              >
                <label className="block text-sm font-medium text-foreground mb-3">
                  {labels.primaryGoal}
                </label>
                <div className="space-y-2">
                  {FINANCIAL_GOALS[formData.personaId].map((goal, index) => (
                    <motion.button
                      key={goal.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      onClick={() => setFormData(prev => ({ ...prev, financialGoal: goal.id }))}
                      className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left flex items-center gap-3 ${
                        formData.financialGoal === goal.id
                          ? 'border-primary bg-primary/10'
                          : 'border-border bg-card hover:border-primary/50'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                        formData.financialGoal === goal.id
                          ? 'bg-primary text-white'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        <goal.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{goal.label}</p>
                        <p className="text-xs text-muted-foreground">{goal.sublabel}</p>
                      </div>
                      {formData.financialGoal === goal.id && (
                        <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                      )}
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* CTA */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                onClick={() => setCurrentStep(3)}
                disabled={!canProceedStep2}
                className={`w-full py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                  canProceedStep2
                    ? 'bg-gradient-primary text-white hover:shadow-glow hover:scale-[1.02] active:scale-[0.98]'
                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                }`}
              >
                <span>{labels.continue}</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </motion.div>
          )}

          {/* Step 3: Bank Linking */}
          {currentStep === 3 && !isFetching && (
            <motion.div
              key="step3"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="max-w-md w-full"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center mb-6"
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Building2 className="w-7 h-7 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-foreground mb-2">{labels.connectWorld}</h2>
                <p className="text-sm text-muted-foreground">{labels.connectDesc}</p>
              </motion.div>

              {/* Bank Grid */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-3 gap-2 mb-4 max-h-[220px] overflow-y-auto p-1"
              >
                {INDIAN_BANKS.map((bank, index) => (
                  <motion.button
                    key={bank.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.02 }}
                    onClick={() => handleBankSelect(bank.id)}
                    className={`p-3 rounded-xl border-2 transition-all duration-200 text-center ${
                      selectedBank === bank.id
                        ? 'border-primary bg-primary/10'
                        : 'border-border bg-card hover:border-primary/50'
                    }`}
                  >
                    <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-muted flex items-center justify-center text-xs font-bold text-primary">
                      {bank.short.slice(0, 3)}
                    </div>
                    <p className="text-xs text-foreground font-medium truncate">{bank.name}</p>
                  </motion.button>
                ))}
              </motion.div>

              {/* Consent Card - Shows when bank selected */}
              <AnimatePresence>
                {showConsent && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-4"
                  >
                    <div className="p-4 rounded-2xl border border-success/20 bg-success/5">
                      <div className="flex items-center gap-2 mb-3">
                        <Shield className="w-4 h-4 text-success" />
                        <span className="text-sm font-semibold text-foreground">Consent Summary</span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <p className="text-muted-foreground flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-success shrink-0 mt-0.5" />
                          <span>FinEd AI will <strong>only see transaction data</strong>. We cannot move your money.</span>
                        </p>
                        <p className="text-muted-foreground flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-success shrink-0 mt-0.5" />
                          <span>Access is valid for <strong>12 months</strong> and can be revoked anytime.</span>
                        </p>
                        <p className="text-muted-foreground flex items-start gap-2">
                          <Lock className="w-4 h-4 text-success shrink-0 mt-0.5" />
                          <span><strong>No storage</strong> of bank credentials. RBI regulated.</span>
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* CTA */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                onClick={handleLinkBank}
                disabled={!selectedBank}
                className={`w-full py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-2 mb-3 ${
                  selectedBank
                    ? 'bg-gradient-primary text-white hover:shadow-glow hover:scale-[1.02] active:scale-[0.98]'
                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                }`}
              >
                <Building2 className="w-5 h-5" />
                <span>{labels.linkBank}</span>
              </motion.button>

              <button
                onClick={() => setCurrentStep(4)}
                className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
              >
                {labels.skip}
              </button>

              <div className="mt-4 flex justify-center gap-3">
                <SecurityBadge text="AES-256 Encryption" icon={Lock} />
                <SecurityBadge text="RBI Regulated" icon={Shield} />
              </div>
            </motion.div>
          )}

          {/* Step 3b: Fetching Animation */}
          {currentStep === 3 && isFetching && (
            <motion.div
              key="step3-fetching"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-md w-full text-center"
            >
              <motion.div
                className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <RefreshCw className="w-10 h-10 text-white" />
              </motion.div>

              <h2 className="text-xl font-bold text-foreground mb-2">
                Fetching your transactions securely...
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                This usually takes less than 90 seconds
              </p>

              <div className="w-full max-w-xs mx-auto mb-4">
                <Progress value={Math.min(fetchProgress, 100)} className="h-2" />
              </div>
              <p className="text-xs text-muted-foreground">
                {fetchProgress < 30 && "Connecting to bank..."}
                {fetchProgress >= 30 && fetchProgress < 60 && "Fetching account details..."}
                {fetchProgress >= 60 && fetchProgress < 90 && "Importing transactions..."}
                {fetchProgress >= 90 && "Almost done..."}
              </p>

              <div className="mt-8 flex justify-center gap-3">
                <SecurityBadge text="AES-256 Encryption" icon={Lock} />
                <SecurityBadge text="RBI Regulated" icon={Shield} />
              </div>
            </motion.div>
          )}

          {/* Step 4: SMS Permission */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="max-w-md w-full text-center"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-accent/10 flex items-center justify-center"
              >
                <Smartphone className="w-7 h-7 text-accent" />
              </motion.div>

              <h2 className="text-xl font-bold text-foreground mb-2">{labels.smsAccess}</h2>
              <p className="text-sm text-muted-foreground mb-6">{labels.smsDesc}</p>

              {/* SMS Mock */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-6"
              >
                <div className="p-4 rounded-2xl border border-border bg-card text-left">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                      <BellRing className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground mb-1">Just now • UPI Alert</p>
                      <p className="text-sm text-foreground">
                        Rs.450 debited from A/c XX4521 to <span className="font-semibold">Swiggy</span> on 19-Jan. UPI Ref: 402912345678
                      </p>
                    </div>
                  </div>
                </div>

                {/* Parsing Animation */}
                <AnimatePresence>
                  {smsGranted && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-3 flex items-center justify-center gap-2"
                    >
                      {!showParsedSms ? (
                        <>
                          <motion.div
                            className="w-2 h-2 rounded-full bg-primary"
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 0.5, repeat: Infinity }}
                          />
                          <span className="text-sm text-primary">Parsing transaction...</span>
                        </>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex items-center gap-3 p-3 rounded-xl bg-success/10 border border-success/20"
                        >
                          <CheckCircle className="w-5 h-5 text-success" />
                          <div className="text-left">
                            <p className="text-sm font-medium text-foreground">Food & Dining</p>
                            <p className="text-xs text-muted-foreground">85% accuracy • Auto-categorized</p>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Education Tooltip */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="p-3 rounded-xl bg-muted/50 border border-border mb-6"
              >
                <p className="text-xs text-muted-foreground">
                  <Eye className="w-3 h-3 inline mr-1" />
                  This helps us track UPI transactions in real-time, even for banks not yet on the digital network
                </p>
              </motion.div>

              {!smsGranted && (
                <>
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    onClick={handleSmsPermission}
                    className="w-full py-4 px-6 rounded-2xl bg-gradient-primary text-white font-semibold text-lg transition-all duration-200 hover:shadow-glow hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 mb-3"
                  >
                    <Eye className="w-5 h-5" />
                    <span>{labels.allowSms}</span>
                  </motion.button>

                  <button
                    onClick={handleComplete}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {labels.skip}
                  </button>

                  <div className="mt-4 flex justify-center">
                    <Tooltip text="We only read UPI transaction alerts" />
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
