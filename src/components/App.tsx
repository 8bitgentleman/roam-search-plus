import {
  Button,
  InputGroup,
  Dialog,
  Classes,
  Divider,
  Menu,
  Popover,
  Position,
  MenuItem,
  Icon,
  ButtonGroup,
  Toaster,
  ControlGroup,
} from "@blueprintjs/core";

import { store } from "../store";
import { enableLegendStateReact, observer } from "@legendapp/state/react";
import { ListContainer } from "./query-result";
import { Sidebar } from "./sidebar";
import { QueryHistory } from "./history-result";
import { FC, useEffect, useRef } from "react";
import { CONSTNATS } from "../helper";
import { BottomPopup } from "./bottom-popup";
enableLegendStateReact();

const LoadingGraph: FC = observer((props) => {
  return (
    <div className={"graph-loading"}>
      {store.ui.isLoadingGraph() ? (
        <div className={`loading-view`}>
          <Button icon="lightbulb" minimal>
            Graph loading
          </Button>
        </div>
      ) : null}
      {props.children}
    </div>
  );
});

const App = observer(() => {
  const ref = useRef<HTMLInputElement>();
  useEffect(() => {
    return store.actions.onVisibleChange((b) => {
      if (b && ref.current) {
        ref.current.focus();
      }
    });
  }, []);
  // console.log(store.ui.isOpen(), " = open");
  return (
    <div
      className={`${CONSTNATS.el} ${
        store.ui.isOpen() ? "visible" : "invisible"
      }`}
    >
      <div
        onClickCapture={store.actions.toggleDialog}
        className={`${CONSTNATS.el}-onevent`}
      />
      <dialog
        open={store.ui.isOpen()}
        className="bp3-dialog"
        style={{
          paddingBottom: 0,
          alignItems: "flex-start",
        }}
      >
        <LoadingGraph>
          <div style={{ display: "flex" }} className="search-content">
            <section className="flex-column main-view">
              <ControlGroup>
                <InputGroup
                  placeholder="search..."
                  leftIcon={
                    store.ui.isLoading() ? (
                      <Icon icon="refresh" size={14} className="loading" />
                    ) : (
                      "search"
                    )
                  }
                  inputRef={ref}
                  fill
                  rightElement={
                    store.ui.isTyped() ? (
                      <Button
                        onClick={() => {
                          store.actions.clearSearch();
                        }}
                        icon="small-cross"
                        minimal
                        small
                      />
                    ) : undefined
                  }
                  value={store.ui.getSearch()}
                  onChange={(e) => store.actions.changeSearch(e.target.value)}
                  onKeyPress={(e) => {
                    // console.log(e.key, " == key");
                    if (e.key === "Enter") {
                      store.actions.searchAgain();
                    }
                  }}
                />
              </ControlGroup>
              {store.ui.isTyped() ? <ListContainer /> : <QueryHistory />}
              <div>
                {store.ui.isMultipleSelection() ? (
                  <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                    {store.ui.isShowSelectedTarget() ? (
                      <Button
                        intent="none"
                        icon="cross"
                        onClick={store.actions.changeShowSelectedTarget}
                      />
                    ) : (
                      <Button
                        intent="success"
                        onClick={store.actions.changeShowSelectedTarget}
                        disabled={store.ui.selectedCount() === 0}
                      >
                        {store.ui.selectedCount()}
                      </Button>
                    )}

                    <Popover
                      interactionKind="hover"
                      position="right"
                      autoFocus={false}
                      content={
                        <Menu>
                          <MenuItem
                            icon="duplicate"
                            text="Copy as one line"
                          ></MenuItem>
                          <MenuItem
                            icon="multi-select"
                            text="Copy as multiple line"
                          ></MenuItem>
                        </Menu>
                      }
                    >
                      <Button
                        disabled={store.ui.selectedCount() === 0}
                        intent="primary"
                        onClick={() => {
                          store.actions.confirmMultiple();
                        }}
                      >
                        Confirm
                      </Button>
                    </Popover>
                  </div>
                ) : null}
              </div>

              <div className={Classes.DIALOG_FOOTER}>
                {store.ui.result.size() > 0 && store.ui.isTyped() ? (
                  <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                    <Popover
                      position="right"
                      interactionKind="hover"
                      usePortal={false}
                      autoFocus={false}
                      content={
                        <Menu>
                          <MenuItem
                            text="As one line"
                            onClick={() => {
                              store.actions.confirm.copyResult(true);
                              Toaster.create().show({
                                intent: "success",
                                icon: "small-tick",
                                message: "References copied",
                              });
                              store.actions.toggleDialog();
                            }}
                          />
                          <MenuItem
                            text="As multiple lines"
                            onClick={() => {
                              store.actions.confirm.copyResult();
                              Toaster.create().show({
                                intent: "success",
                                icon: "small-tick",
                                message: "References copied",
                              });
                              store.actions.toggleDialog();
                            }}
                          />
                        </Menu>
                      }
                    >
                      <Button rightIcon="chevron-right" intent="primary">
                        Copy results
                      </Button>
                    </Popover>
                  </div>
                ) : null}
                <sub className="hint">shift+ open in sidebar</sub>
              </div>
            </section>
            <Sidebar />
          </div>
        </LoadingGraph>
      </dialog>
    </div>
  );
});

const MobileApp = observer(() => {
  const ref = useRef<HTMLInputElement>();
  useEffect(() => {
    return store.actions.onVisibleChange((b) => {
      if (b && ref.current) {
        ref.current.focus();
      }
    });
  }, []);
  return (
    <BottomPopup
      className={`${CONSTNATS.el}`}
      isOpen={store.ui.isOpen()}
      onClose={() => store.actions.toggleDialog()}
      canOutsideClickClose={!store.ui.isFilterOpen()}
      canEscapeKeyClose={!store.ui.isFilterOpen()}
      portalClassName={`${CONSTNATS.el}-portal`}
    >
      <div className={Classes.DRAWER_BODY}>
        <LoadingGraph>
          <div className="search-content">
            <section className="flex-column main-view">
              <ControlGroup>
                <InputGroup
                  placeholder="search..."
                  leftIcon={
                    store.ui.isLoading() ? (
                      <Icon icon="refresh" size={14} className="loading" />
                    ) : (
                      "search"
                    )
                  }
                  inputRef={ref}
                  fill
                  rightElement={
                    store.ui.isTyped() ? (
                      <Button
                        onClick={() => {
                          store.actions.clearSearch();
                        }}
                        icon="small-cross"
                        minimal
                        small
                      />
                    ) : undefined
                  }
                  value={store.ui.getSearch()}
                  onChange={(e) => {
                    store.actions.changeSearch(e.target.value);
                  }}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      store.actions.searchAgain();
                    }
                  }}
                />
              </ControlGroup>
              {store.ui.isTyped() ? <ListContainer /> : <QueryHistory />}
              <div>
                {store.ui.isMultipleSelection() ? (
                  <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                    {store.ui.isShowSelectedTarget() ? (
                      <Button
                        intent="none"
                        icon="cross"
                        onClick={store.actions.changeShowSelectedTarget}
                      />
                    ) : (
                      <Button
                        intent="success"
                        onClick={store.actions.changeShowSelectedTarget}
                        disabled={store.ui.selectedCount() === 0}
                      >
                        {store.ui.selectedCount()}
                      </Button>
                    )}

                    <Popover
                      interactionKind="hover"
                      position="right"
                      autoFocus={false}
                      content={
                        <Menu>
                          <MenuItem
                            icon="duplicate"
                            text="Copy as one line"
                          ></MenuItem>
                          <MenuItem
                            icon="multi-select"
                            text="Copy as multiple line"
                          ></MenuItem>
                        </Menu>
                      }
                    >
                      <Button
                        disabled={store.ui.selectedCount() === 0}
                        intent="primary"
                        onClick={() => {
                          store.actions.confirmMultiple();
                        }}
                      >
                        Confirm
                      </Button>
                    </Popover>
                  </div>
                ) : null}
              </div>

              <div className={Classes.DIALOG_FOOTER}>
                {store.ui.result.size() > 0 && store.ui.isTyped() ? (
                  <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                    <Popover
                      position="right"
                      interactionKind="hover"
                      usePortal={false}
                      autoFocus={false}
                      content={
                        <Menu>
                          <MenuItem
                            text="As one line"
                            onClick={() => {
                              store.actions.confirm.copyResult(true);
                              Toaster.create().show({
                                intent: "success",
                                icon: "small-tick",
                                message: "References copied",
                              });
                              store.actions.toggleDialog();
                            }}
                          />
                          <MenuItem
                            text="As multiple lines"
                            onClick={() => {
                              store.actions.confirm.copyResult();
                              Toaster.create().show({
                                intent: "success",
                                icon: "small-tick",
                                message: "References copied",
                              });
                              store.actions.toggleDialog();
                            }}
                          />
                        </Menu>
                      }
                    >
                      <Button rightIcon="chevron-right" intent="primary">
                        Copy results
                      </Button>
                    </Popover>
                  </div>
                ) : null}
              </div>
            </section>
          </div>
        </LoadingGraph>
      </div>
    </BottomPopup>
  );
});

export default observer(() => {
  if (window.roamAlphaAPI.platform.isMobile) {
    return <MobileApp />;
  }

  return <App />;
});
