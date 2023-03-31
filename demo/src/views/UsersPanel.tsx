import React, { FC, useEffect, useMemo, useState } from "react";
import { useSigma } from "react-sigma-v2";
import { sortBy, values, keyBy, mapValues } from "lodash";
import { MdGroupWork } from "react-icons/md";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";

import { User, FiltersState } from "../types";
import Panel from "./Panel";

const UsersPanel: FC<{
  users: User[];
  filters: FiltersState;
  toggleUser: (user: string) => void;
  setUsers: (users: Record<string, boolean>) => void;
}> = ({ users, filters, toggleUser, setUsers }) => {
  const sigma = useSigma();
  const graph = sigma.getGraph();

  const nodesPerUser = useMemo(() => {
    const index: Record<string, number> = {};
    graph.forEachNode((_, { user }) => (index[user] = (index[user] || 0) + 1));
    return index;
  }, []);

  const maxNodesPerUser = useMemo(() => Math.max(...values(nodesPerUser)), [nodesPerUser]);
  const visibleUsersCount = useMemo(() => Object.keys(filters.users).length, [filters]);

  const [visibleNodesPerUser, setVisibleNodesPerUser] = useState<Record<string, number>>(nodesPerUser);
  useEffect(() => {
    // To ensure the graphology instance has up to data "hidden" values for
    // nodes, we wait for next frame before reindexing. This won't matter in the
    // UX, because of the visible nodes bar width transition.
    requestAnimationFrame(() => {
      const index: Record<string, number> = {};
      graph.forEachNode((_, { user, hidden }) => !hidden && (index[user] = (index[user] || 0) + 1));
      setVisibleNodesPerUser(index);
    });
  }, [filters]);

  const sortedUsers = useMemo(
    () => sortBy(users, (user) => -nodesPerUser[user.key]),
    [users, nodesPerUser],
  );

  return (
    <Panel
      title={
        <>
          <MdGroupWork className="text-muted" /> Utilisateurs
          {visibleUsersCount < users.length ? (
            <span className="text-muted text-small">
              {" "}
              ({visibleUsersCount} / {users.length})
            </span>
          ) : (
            ""
          )}
        </>
      }
    >
      <p>
        <i className="text-muted">Cliquez sur un user pour afficher/masquer</i>
      </p>
      <p className="buttons">
        <button className="btn" onClick={() => setUsers(mapValues(keyBy(users, "key"), () => true))}>
          <AiOutlineCheckCircle /> Tout sélectionner
        </button>{" "}
        <button className="btn" onClick={() => setUsers({})}>
          <AiOutlineCloseCircle /> Tout désélectionner
        </button>
      </p>
      <ul>
        {sortedUsers.map((user) => {
          const nodesCount = nodesPerUser[user.key];
          const visibleNodesCount = visibleNodesPerUser[user.key] || 0;
          return (
            <li
              className="caption-row"
              key={user.key}
              title={`${nodesCount} page${nodesCount > 1 ? "s" : ""}${
                visibleNodesCount !== nodesCount ? ` (seulement ${visibleNodesCount} visibles)` : ""
              }`}
            >
              <input
                type="checkbox"
                checked={filters.users[user.key] || false}
                onChange={() => toggleUser(user.key)}
                id={`user-${user.key}`}
              />
              <label htmlFor={`user-${user.key}`}>
                <span className="circle" style={{ background: user.color, borderColor: user.color }} />{" "}
                <div className="node-label">
                  <span><a target="_blank"  rel="noreferrer" href='https://wiki.net.extra.laposte.fr/confluence/dosearchsite.action?additional=none&labels=&contentType=&queryString="{user.userLabel}'> - {user.userLabel}</a></span>
                  <div className="bar" style={{ width: (100 * nodesCount) / maxNodesPerUser + "%" }}>
                    <div
                      className="inside-bar"
                      style={{
                        width: (100 * visibleNodesCount) / nodesCount + "%",
                      }}
                    />
                  </div>
                </div>
              </label>
            </li>
          );
        })}
      </ul>
    </Panel>
  );
};

export default UsersPanel;
