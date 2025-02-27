<style lang="less" scoped>
.send-row {
    position: fixed;
    bottom: 0;
    width: 100%;
    background: #fff;
}
.message-list-wrapper {
    height: 82vh;
    background: #eee;
    position: relative;
}
.message-list {
    background-color: inherit;
    height: 100%;
    overflow-y: scroll;
}
.text-content {
    width: auto;
    flex-basis: 0;
}
.message-alert {
    position: absolute;
    top: 0;
    width: 100%;
    z-index: 1;
    background: #eeeeee;
}
.vertical-text {
    writing-mode: vertical-lr;
}
.message-v-list {
    min-height: 100%;
    background: inherit;
}
.card {
    background: transparent;
}
.msg-content-system {
    height: 100%;
    background: #fff;
    display: inline-block;
}
.msg-content-user {
    height: 100%;
    background: #a0e75b;
    display: inline-block;
}
.message-content {
    display: inline-block;
}
</style>
<template>
  <v-container class="pa-0">
    <header-bar class="pa-2" title="我的消息"></header-bar>
    <v-divider></v-divider>
    <div ref="messageListWrapper" class="message-list-wrapper">
      <v-alert
        color="white"
        @click.native="onTipClick"
        :value="unReadMessageCount>0"
        tile
        class="message-alert text-center caption"
        dense
      >
        您有
        <span class="blue--text">{{unReadMessageCount}}</span>
        条未读消息
        <span class="vertical-text body-1">››</span>
        <!-- <v-btn @click.stop="updateUnReadMessage" color="primary" text x-small class="float-right" size="small">标记为已读</v-btn> -->
      </v-alert>
      <div
        class="message-list pb-2"
        id="scrollMessageList"
        ref="scrollContainer"
        v-scroll:#scrollMessageList="onListScroll"
      >
        <v-list class="message-v-list" ref="messageList">
          <template v-for="item in messages">
            <v-list-item class="d-flex align-start mb-2" v-if="item.isPublish===1" :key="item.id">
              <v-list-item-content class="py-0">
                <v-list-item-title class="caption text-center"></v-list-item-title>
                <v-card flat class="card d-flex justify-center">
                  <span
                    class="pa-2 grey d-inline-bolck white--text lighten-1 caption"
                  >系统公告：{{item.msgContent}}</span>
                </v-card>
              </v-list-item-content>
            </v-list-item>
            <v-list-item
              v-else-if="item.msgToUser === 1"
              :key="item.id"
              class="d-flex align-start mb-2"
              :ref="item.__unReadMark ? 'firstUnReadMsg' : ''"
            >
              <v-avatar size="40" color="grey" class="mr-2">
                <v-icon color="white">people</v-icon>
              </v-avatar>
              <v-list-item-content class="py-0">
                <v-list-item-title class="caption">高考客服</v-list-item-title>
                <v-list-item-title class="caption">{{formatTime(item.sendTime)}}</v-list-item-title>
                <v-card flat class="card">
                  <span
                    class="pa-2 msg-content-system d-inline-bolck grey--text text--darken-2 caption"
                  >{{item.msgContent}}</span>
                </v-card>
              </v-list-item-content>
            </v-list-item>
            <v-list-item
              v-else
              :key="item.id"
              :ref="item.__unReadMark ? 'firstUnReadMsg' : ''"
              class="d-flex align-start mb-2"
            >
              <v-list-item-content class="py-0 text-content pl-6">
                <v-list-item-title class="caption">{{userInfo.userName}}</v-list-item-title>
                <v-list-item-title class="caption text-right">{{formatTime(item.sendTime)}}</v-list-item-title>
                <v-card flat class="card text-right">
                  <span
                    class="pa-2 inline-block msg-content-user grey--text text--darken-2 caption"
                  >{{item.msgContent}}</span>
                </v-card>
              </v-list-item-content>
              <v-avatar size="40" color="grey" class="ml-2">
                <!-- <v-icon color="white">people</v-icon> -->
                <v-img src="https://img.bq233.com/kanqq/pic/upload/2018/1008/1538990780284934.jpg"></v-img>
              </v-avatar>
            </v-list-item>
          </template>
        </v-list>
      </div>
    </div>

    <v-row class="send-row" no-gutters>
      <v-col cols="12">
        <v-divider></v-divider>
      </v-col>
      <v-col class="pl-4 py-2" cols="9">
        <v-text-field height="6vh" v-model="message" outlined dense hide-details></v-text-field>
      </v-col>
      <v-col cols="3" class="pl-2 py-2">
        <v-btn @click="sendMessage()" height="100%" color="primary">留言</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, Prop, Ref } from "vue-property-decorator";
import { withLoading } from "../decorators/with-loading";
import { createDebounce } from "../util";
import moment from "moment";
import { UserInfo } from "../store/use-state";
import { startAsyncGuide } from "../loginGuideController";

let scrollHander!: () => void;

interface Message {
    msgContent: string;
    // 0 unread, 1 read
    isRead: 0 | 1;
    // 0 user question, 1 systen message
    msgToUser: 0 | 1;
    sendTime: string;
    id: string;
    userID: string;
    isPublish: 0 | 1;
    __unReadMark?: boolean;
}

export enum MessageTypeCode {
    "DEFAULT",
    "UNIVERSITY",
    "MAJOR",
    "EXAMIZE",
    "USER"
}

const systemId = "00000000-0000-0000-0000-000000000000";

@Component({
    name: "Message"
})
export default class extends Vue {
    private message: string = "";
    private shouldShowMessageTip: boolean = true;
    private messages: Message[] = [];
    private async created() {
        if (this.isLogin) {
            await this.getAllMessages();
            this.parseRouteMessage();
            scrollHander = createDebounce(this.updateUnReadMessage, 1000, 6000);
            this.onListScroll();
        } else {
            await this.getSystemMessages();
        }
    }

    private parseRouteMessage() {
        const query = this.$route.query;
        if (query.typeCode) {
            this.message = query.template as string;
            this.sendMessage(parseInt(query.typeCode as string, 10));
        }
    }

    private async sendMessageToPlatform(typeCode: MessageTypeCode) {
        return await this.$http.post<ResponseModel<string>>(
            "/api/Messages/SendDefaultToPlat",
            {
                typeCode,
                msg: this.message
            }
        );
    }

    private async getSystemMessages() {
        const rsp = await this.$http.get<ResponseModel<Message[]>>(
            "/api/Messages/GetMsgCount"
        );
        this.messages = rsp.data.data;
    }

    get isLogin(): boolean {
        return this.$store.getters.isLogin;
    }

    get userInfo(): UserInfo {
        return this.$store.state.userState.userInfo;
    }

    get unReadMessageCount(): number {
        return this.unReadMessages.length;
    }

    get unReadMessages(): Message[] {
        return this.messages.filter(
            (item) => item.isRead === 0 && item.isPublish !== 1
        );
    }

    private formatTime(timeString: string) {
        const oneDay = 24 * 60 * 60 * 1000;
        // same day
        if (
            moment(new Date()).format("YYYYMMDD") ===
            moment(timeString).format("YYYYMMDD")
        ) {
            return moment(timeString).format("HH:mm:ss");
        }
        return moment(timeString).format("YYYY-MM-DD HH:mm:ss");
    }

    private onTipClick() {
        this.goFirstUnReadMessage();
        this.updateUnReadMessage();
    }
    private goFirstUnReadMessage() {
        const firstUnReadMsg = this.$refs.firstUnReadMsg as any[];
        if (firstUnReadMsg && firstUnReadMsg[0]) {
            const unReadMsgEl = firstUnReadMsg[0].$el as HTMLDivElement;
            this.scrollTo(unReadMsgEl.offsetTop);
        }
    }

    private scrollTo(top: number) {
        const scrollContainer = this.$refs.scrollContainer as HTMLDivElement;
        scrollContainer.scroll({
            top,
            behavior: "smooth"
        });
    }

    private goBottom() {
        const messageList = this.$refs.messageList as any;
        const messageEl = messageList.$el as HTMLDivElement;
        const offsetHeight = messageEl.offsetHeight;
        this.scrollTo(offsetHeight);
    }

    private onListScroll() {
        const scrollContainer = this.$refs.scrollContainer as HTMLDivElement;
        const messageList = this.$refs.messageList as any;
        const messageEl = messageList.$el as HTMLDivElement;
        if (
            messageEl.clientHeight - scrollContainer.scrollTop <=
            scrollContainer.clientHeight
        ) {
            if (this.unReadMessageCount > 0) {
                scrollHander();
            }
        }
    }

    private async updateUnReadMessage() {
        const unReadIds = this.unReadMessages.map((item) => item.id).join("|");
        const rsp = await this.$http.put(
            "/api/Messages/SetRead",
            {
                toUserIDs: unReadIds,
                systemIDs: this.messages
                    .filter((item) => item.isPublish === 1 && item.isRead === 0)
                    .map((item) => item.id)
                    .join("|")
            },
            {
                headers: {
                    "content-type": "application/json-patch+json"
                }
            }
        );
        this.unReadMessages.forEach((item) => {
            item.isRead = 1;
        });
    }

    @withLoading()
    private async getAllMessages() {
        const rsp = await this.$http.get<ResponseModel<Message[]>>(
            "/api/Messages/GetMsg"
        );

        this.markFirstUnReadMessage(rsp.data.data);

        this.messages = rsp.data.data;
    }

    private markFirstUnReadMessage(messages: Message[]) {
        for (const item of messages) {
            if (item.isRead === 0) {
                item.__unReadMark = true;
                return;
            }
        }
    }

    private async sendMessage(typeCode: MessageTypeCode = 0) {
        if (!this.isLogin) {
            await startAsyncGuide().then(() => {
                this.$router.push({
                    path: "/login",
                    query: {
                        redirect: this.$route.fullPath
                    }
                });
            });
            return;
        }

        const rsp = await this.sendMessageToPlatform(MessageTypeCode.USER);

        if (rsp.data.state === 0) {
            this.messages.push({
                msgContent: this.message,
                isRead: 1,
                msgToUser: 0,
                sendTime: new Date().toUTCString(),
                id: "",
                userID: "",
                isPublish: 0
            });
        }
        this.message = "";

        // await this.getAllMessages();
        this.$nextTick(this.goBottom);
    }
}
</script>