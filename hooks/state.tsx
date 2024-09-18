"use client";
import React, { createContext, useReducer, useContext } from "react";

const initialState = {};

const StateContext = createContext(initialState);

const stateReducer = (state: any, action: any) => {
    switch (action.type) {
        case "SET_STATE":
            return {
                ...state,
                [action.key]: action.value,
            };
        case "REMOVE_STATE":
            const newState = { ...state };
            delete newState[action.key];
            return newState;
        case "UPDATE_STATE":
            return {
                ...state,
                [action.key]: {
                    ...state[action.key],
                    ...action.value,
                },
            };
        case "ADD_DIRECT_STATE":
            return {
                ...state,
                ...action.value,
            };
        case "CLEAR_ALL":  // New case for clearing all state
            return {};
        default:
            return state;
    }
};

export const StateProvider = ({ children }: any) => {
    const [state, dispatch] = useReducer(stateReducer, initialState);

    const setState = (key: any, value: any) => {
        // const processedValue = processStateStructure(value);
        dispatch({ type: "SET_STATE", key, value });
    };

    const removeState = (key: any) => {
        dispatch({ type: "REMOVE_STATE", key });
    };
    const setRawState = (key: any, value: any) => {
        dispatch({ type: "SET_STATE", key, value });
    };



    const updateState = (key: any, value: any) => {
        dispatch({ type: "UPDATE_STATE", key, value });
    };
    const getMatchingKeys = (pattern: string) => {
        return Object.keys(state).filter((key) => key.includes(pattern));
    };
    const addDirectState = (value: any) => {
        dispatch({ type: "ADD_DIRECT_STATE", value });
    };
    const clearAll = () => {
        dispatch({ type: "CLEAR_ALL" });
    };
    const getStateByKeys = (keys: any[]) => {
        return keys.reduce((result, key) => {
            if (state[key] !== undefined) {
                result[key] = state[key];
            }
            return result;
        }, {});
    };

    return (
        <StateContext.Provider
            value={{
                state,
                setState,
                setRawState,
                removeState,
                updateState,
                getStateByKeys,
                getMatchingKeys,
                addDirectState,
                clearAll
            }}
        >
            {children}
        </StateContext.Provider>
    );
};

export const useAppState = () => {
    const context = useContext(StateContext);
    if (!context) {
        throw new Error("useAppState must be used within a StateProvider");
    }
    return context;
};
