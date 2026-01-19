import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, CheckCircle, ChevronLeft, ChevronRight, Smartphone, ArrowRight, Building2, Zap, RefreshCw, Eye, BellRing } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface OnboardingFlowProps {
  personaId: string;
  onComplete: () => void;
}

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
  { id: 'federal', name: 'Federal Bank', short: 'FEDERAL' },
  { id: 'rbl', name: 'RBL Bank', short: 'RBL' },
  { id: 'idfc', name: 'IDFC First Bank', short: 'IDFC' },
];

export function OnboardingFlow({ personaId, onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchProgress, setFetchProgress] = useState(0);
  const [smsGranted, setSmsGranted] = useState(false);
  const [showParsedSms, setShowParsedSms] = useState(false);
  
  const isStudent = personaId === 'priya';
  
  const pageVariants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
  };

  const handleBankSelect = (bankId: string) => {
    setSelectedBank(bankId);
  };

  const handleLinkBank = () => {
    if (!selectedBank) return;
    setIsFetching(true);
    setFetchProgress(0);
    
    // Simulate progress over ~3 seconds (fast simulation)
    const interval = setInterval(() => {
      setFetchProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsFetching(false);
            setCurrentStep(3);
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
      setCurrentStep(4);
    }, 2500);
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
      <div className="p-4 border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-2">
            {currentStep > 1 && currentStep < 4 && (
              <button 
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <span className="text-sm text-muted-foreground ml-auto">
              Step {currentStep} of 4
            </span>
          </div>
          <Progress value={(currentStep / 4) * 100} className="h-1.5" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-8">
        <AnimatePresence mode="wait">
          {/* Step 1: Value Prop */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="max-w-md w-full text-center"
            >
              {/* Security Badge */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex justify-center gap-2 mb-6"
              >
                <SecurityBadge text="RBI Regulated" icon={Shield} />
                <SecurityBadge text="Bank-Grade Security" icon={Lock} />
              </motion.div>

              {/* Visual */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="relative mb-8"
              >
                <div className="w-40 h-40 mx-auto relative">
                  {/* Bank Icon */}
                  <motion.div
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 flex items-center justify-center"
                    animate={{ x: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Building2 className="w-8 h-8 text-primary" />
                  </motion.div>
                  
                  {/* Connection Line */}
                  <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 rounded-full bg-secondary"
                        animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                      />
                    ))}
                  </motion.div>
                  
                  {/* Cloud Icon */}
                  <motion.div
                    className="absolute right-0 top-1/2 -translate-y-1/2 w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow"
                    animate={{ x: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <span className="text-2xl">💰</span>
                  </motion.div>
                </div>
              </motion.div>

              {/* Heading */}
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl md:text-3xl font-bold text-foreground mb-3"
              >
                Your Finances, Automated.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-muted-foreground mb-8 leading-relaxed"
              >
                Securely link your bank account to see where every rupee goes.{' '}
                <span className="text-foreground font-medium">No manual typing, no spreadsheets.</span>
              </motion.p>

              {/* CTA */}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                onClick={() => setCurrentStep(2)}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-primary text-white font-semibold text-lg transition-all duration-200 hover:shadow-glow hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <span>Link My Bank Account</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-4 flex justify-center"
              >
                <Tooltip text="AES-256 Encrypted • NPCI Certified" />
              </motion.div>
            </motion.div>
          )}

          {/* Step 2: AA Simulation */}
          {currentStep === 2 && !isFetching && (
            <motion.div
              key="step2"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="max-w-md w-full"
            >
              {/* Header */}
              <div className="text-center mb-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-secondary/10 flex items-center justify-center"
                >
                  <Building2 className="w-7 h-7 text-secondary" />
                </motion.div>
                <h2 className="text-xl font-bold text-foreground mb-2">Select Your Bank</h2>
                <p className="text-sm text-muted-foreground">
                  Choose your bank to connect via Account Aggregator
                </p>
              </div>

              {/* Bank List */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-3 gap-2 mb-6 max-h-[280px] overflow-y-auto p-1"
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

              {/* Consent Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="p-4 rounded-2xl border border-border bg-card mb-6"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-4 h-4 text-success" />
                  <span className="text-sm font-semibold text-foreground">Consent Details</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span>12-month data access</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <RefreshCw className="w-4 h-4 text-success" />
                    <span>Daily sync at 6 AM</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Lock className="w-4 h-4 text-success" />
                    <span>No storage of bank credentials</span>
                  </div>
                </div>
              </motion.div>

              {/* CTA */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                onClick={handleLinkBank}
                disabled={!selectedBank}
                className={`w-full py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                  selectedBank
                    ? 'bg-gradient-primary text-white hover:shadow-glow hover:scale-[1.02] active:scale-[0.98]'
                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                }`}
              >
                <span>Link Bank Account</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>

              <div className="mt-4 flex justify-center">
                <Tooltip text="Powered by Sahamati Account Aggregator" />
              </div>
            </motion.div>
          )}

          {/* Step 2b: Fetching Animation */}
          {currentStep === 2 && isFetching && (
            <motion.div
              key="step2-fetching"
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

          {/* Step 3: SMS Permissions */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
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

              <h2 className="text-xl font-bold text-foreground mb-2">Real-time Tracking</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Allow SMS access to instantly categorize your UPI transactions
              </p>

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

              {!smsGranted && (
                <>
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    onClick={handleSmsPermission}
                    className="w-full py-4 px-6 rounded-2xl bg-gradient-primary text-white font-semibold text-lg transition-all duration-200 hover:shadow-glow hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 mb-3"
                  >
                    <Eye className="w-5 h-5" />
                    <span>Allow SMS Access</span>
                  </motion.button>

                  <button
                    onClick={() => setCurrentStep(4)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Skip for now
                  </button>

                  <div className="mt-4 flex justify-center">
                    <Tooltip text="We only read UPI transaction alerts" />
                  </div>
                </>
              )}
            </motion.div>
          )}

          {/* Step 4: Aha Moment */}
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
              {/* Success Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="w-20 h-20 mx-auto mb-6 rounded-full bg-success flex items-center justify-center"
              >
                <CheckCircle className="w-10 h-10 text-white" />
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-bold text-foreground mb-2"
              >
                You're all set! 🎉
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-muted-foreground mb-6"
              >
                We've analyzed your spending patterns
              </motion.p>

              {/* Insight Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="p-5 rounded-2xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 text-left mb-8"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shrink-0">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-1">First Insight</p>
                    {isStudent ? (
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        We found <span className="text-accent font-semibold">₹1,800 spent on food delivery</span> this month. 
                        That's <span className="text-accent font-semibold">45% of your pocket money!</span> Let's create a smarter budget together.
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        We found <span className="text-accent font-semibold">₹4,500 spent on food delivery</span> this month. 
                        That's <span className="text-accent font-semibold">40% of your income!</span> Let's fix that.
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* CTA */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                onClick={onComplete}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-primary text-white font-semibold text-lg transition-all duration-200 hover:shadow-glow hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <span>Take me to my Dashboard</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-4"
              >
                <p className="text-xs text-muted-foreground">
                  Your data is protected with bank-grade encryption
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
