import { configureStore } from "@reduxjs/toolkit";
import partidoReducer from "../features/partidos/partidoSlice";
import participanteReducer from "../features/participantes/participanteSlice";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import authReducer from "../features/auth/authSlice"
import pronosticoReducer from "../features/pronosticos/pronosticoSlice";
import resultadoReducer from "../features/resultados/resultadoSlice";
import resetReducer from "../features/reset/resetSlice";


export const makeStore = ()=> {
    return configureStore({
        reducer: {
            partidos: partidoReducer,
            participantes: participanteReducer,
            auth: authReducer,
            pronosticos: pronosticoReducer,
            resultados: resultadoReducer,
            reset: resetReducer,
        },
    });
};

export type RootState = ReturnType<ReturnType<typeof makeStore>["getState"]>;
export type AppDispatch = ReturnType<typeof makeStore>["dispatch"];
export type AppStore = ReturnType<typeof makeStore>;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;