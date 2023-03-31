import React, { KeyboardEvent, ChangeEvent, FC, useEffect, useState } from "react";
import { useSigma } from "react-sigma-v2";
import { Attributes } from "graphology-types";
import { BsSearch } from "react-icons/bs";

import { FiltersState } from "../types";

/**
 * This component is basically a fork from React-sigma-v2's SearchControl
 * component, to get some minor adjustments:
 * 1. We need to hide hidden nodes from results
 * 2. We need custom markup
 */
const SearchField: FC<{ filters: FiltersState }> = ({ filters }) => {
  const sigma = useSigma();

  const [search, setSearch] = useState<string>("");
  const [values, setValues] = useState<Array<{ id: string; label: string; textelibre: string }>>([]);
  const [selected, setSelected] = useState<string | null>(null);

  const refreshValues = () => {
    const newValues: Array<{ id: string; label: string; textelibre: string }> = [];
    const lcSearch = search.toLowerCase();
    if (!selected && search.length > 1) {
      sigma.getGraph().forEachNode((key: string, attributes: Attributes): void => {
        if (!attributes.hidden && attributes.label && ( attributes.label.toLowerCase().indexOf(lcSearch) === 0 || (typeof attributes.textelibre !== 'undefined' && attributes.textelibre.toLowerCase().indexOf(lcSearch) === 0)))
/* TODO Ajouter recherche ignorant _-... */
          if ( typeof attributes.textelibre !== 'undefined')
            newValues.push({ id: key, label: attributes.label, textelibre: attributes.textelibre});
          else 
            newValues.push({ id: key, label: attributes.label, textelibre: '' });
      });
    }
    setValues(newValues);
  };

  // Refresh values when search is updated:
  useEffect(() => refreshValues(), [search]);

  // Refresh values when filters are updated (but wait a frame first):
  useEffect(() => {
    requestAnimationFrame(refreshValues);
  }, [filters]);

  useEffect(() => {
    if (!selected) return;

    sigma.getGraph().setNodeAttribute(selected, "highlighted", true);
    const nodeDisplayData = sigma.getNodeDisplayData(selected);

    if (nodeDisplayData)
      sigma.getCamera().animate(
        { ...nodeDisplayData, ratio: 0.05 },
        {
          duration: 600,
        },
      );

    return () => {
      sigma.getGraph().setNodeAttribute(selected, "highlighted", false);
    };
  }, [selected]);

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const searchString = e.target.value;
    const valueItem = values.find(function (value) {
      // console.log(value)
      return ( value.label === searchString || value.textelibre === searchString);
    })
    if (valueItem) {
      setSearch(valueItem.label);
      setValues([]);
      setSelected(valueItem.id);
    } else {
      setSelected(null);
      setSearch(searchString);
    }
  };

  const onKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && values.length) {
      setSearch(values[0].label);
      setSelected(values[0].id);
    }
  };

  const divStyle = {
    /* TODO amelioerer rechrche dans sous champcolor: 'red' */
  };

  return (
    <div className="search-wrapper"  style={divStyle}>
      <input
        type="search"
        placeholder="Tapez ici pour rechercher..."
        list="nodes"
        value={search}
        onChange={onInputChange}
        onKeyPress={onKeyPress}
      />
      <BsSearch className="icon" />
      <datalist id="nodes" style={divStyle}>
        {values.map((value: { id: string; label: string; textelibre: string }) => (
          <option key={value.id} value={value.label}>
            {value.label}
          </option>
        ))}
      </datalist>
    </div>
  );
};

export default SearchField;
