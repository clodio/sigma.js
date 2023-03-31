import React, { FC } from "react";
import { BsInfoCircle } from "react-icons/bs";

import Panel from "./Panel";

const DescriptionPanel: FC = () => {
  return (
    <Panel
      initiallyDeployed
      title={
        <>
          <BsInfoCircle className="text-muted" /> Description
        </>
      }
    >
      <div className="description_panel_content">
      <p>
        Cette carte représente le réseau des applications, topic kafka.<br/>
       Chaque{" "}<i>noeud</i> represente soit une application,un consommateur kafka ou un topic kafka, et chaque relation un{" "}
        lien.
      </p>
      </div>
    </Panel>
  );
};

export default DescriptionPanel;
