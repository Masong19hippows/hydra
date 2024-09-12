import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { logger } from "../../logger";

import { CheckboxField } from "@renderer/components";
import { useAppSelector } from "@renderer/hooks";
import { settingsContext } from "@renderer/context";

export function SettingsBehavior() {
  const userPreferences = useAppSelector(
    (state) => state.userPreferences.value
  );

  logger.log(userPreferences);

  const [showRunAtStartup, setShowRunAtStartup] = useState(false);

  const { updateUserPreferences } = useContext(settingsContext);

  const [form, setForm] = useState({
    preferQuitInsteadOfHiding: false,
    runAtStartup: false,
  });

  const { t } = useTranslation("settings");

  useEffect(() => {
    if (userPreferences) {
      setForm({
        preferQuitInsteadOfHiding: userPreferences.preferQuitInsteadOfHiding,
        runAtStartup: userPreferences.runAtStartup,
      });
    }
  }, [userPreferences]);

  useEffect(() => {
    window.electron.isPortableVersion().then((isPortableVersion) => {
      setShowRunAtStartup(!isPortableVersion);
    });
  }, []);

  const handleChange = (values: Partial<typeof form>) => {
    setForm((prev) => ({ ...prev, ...values }));
    updateUserPreferences(values);
  };

  return (
    <>
      <CheckboxField
        label={t("quit_app_instead_hiding")}
        checked={form.preferQuitInsteadOfHiding}
        onChange={() =>
          handleChange({
            preferQuitInsteadOfHiding: !form.preferQuitInsteadOfHiding,
          })
        }
      />

      {showRunAtStartup && (
        <CheckboxField
          label={t("launch_with_system")}
          onChange={() => {
            handleChange({ runAtStartup: !form.runAtStartup });
            window.electron.autoLaunch(!form.runAtStartup);
          }}
          checked={form.runAtStartup}
        />
      )}
    </>
  );
}
