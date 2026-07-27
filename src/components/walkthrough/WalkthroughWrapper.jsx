import React, { useState, useEffect } from "react";
import { Joyride, STATUS } from "react-joyride";
import WelcomeModal from "./WelcomeModal";
import CustomTooltip from "./CustomTooltip";
import { walkthroughSteps } from "./walkthroughSteps";

const WalkthroughWrapper = () => {
  const [showWelcome, setShowWelcome] = useState(false);
  const [runTour, setRunTour] = useState(false);

  useEffect(() => {
    // Only show the walkthrough if the new-signup flag was explicitly set
    const shouldShow =
      localStorage.getItem("show_welcome_walkthrough") === "true" ||
      localStorage.getItem("is_new_signup") === "true";

    if (shouldShow) {
      setShowWelcome(true);
    }
  }, []);

  const handleStartWalkthrough = () => {
    setShowWelcome(false);
    setTimeout(() => {
      setRunTour(true);
    }, 150);
  };

  const handleSkipWalkthrough = () => {
    setShowWelcome(false);
    setRunTour(false);
    clearWalkthroughFlags();
  };

  const clearWalkthroughFlags = () => {
    localStorage.removeItem("show_welcome_walkthrough");
    localStorage.removeItem("is_new_signup");
  };

  const handleJoyrideCallback = (data) => {
    const { status } = data;
    const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setRunTour(false);
      clearWalkthroughFlags();
    }
  };

  return (
    <>
      {/* Welcome Modal */}
      <WelcomeModal
        isOpen={showWelcome}
        onStart={handleStartWalkthrough}
        onSkip={handleSkipWalkthrough}
      />

      {/* Joyride Tour */}
      <Joyride
        steps={walkthroughSteps}
        run={runTour}
        continuous={true}
        showSkipButton={true}
        showProgress={false}
        disableOverlayClose={true}
        disableScrollParentFix={true}
        scrollToFirstStep={true}
        scrollOffset={100}
        tooltipComponent={CustomTooltip}
        callback={handleJoyrideCallback}
        styles={{
          options: {
            zIndex: 10000,
            arrowColor: "#ffffff",
          },
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
        }}
      />
    </>
  );
};

export default WalkthroughWrapper;
