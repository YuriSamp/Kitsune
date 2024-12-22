---
title: 'Comments in code'
description: 'Sometimes comments are useful'
pubDate: 'Dec 21 2024'
---

One of the best books on software engineering that I've read this year was "A Philosophy of Software Design", I found this book when I was reading this amazing [article](https://alexkondov.com/program-errors-out-of-existence/) by Alex kordov, where he addresses one of the best chapters of this book - "Define errors out of existence" and how can you apply this rule in your code. Nonetheless, I want to give my 2 cents about other things that I liked about this book.

Besides the idea of how to handle errors, the author talked a lot about one thing that stuck in my mind for some time: comments in code. I can already foresee what you are thinking, "Good code doesn't need comments", "Comments will be out of date quickly", and "A lot of comments that I see are useless."... Ok, I get your point and I think you are right in a lot of the cases, in my first reading of these chapters I was a little bothered because I never write any comments on my code and my company doesn't encourage this practice as well, so I couldn't see the value to write comments in the day a day code until I try to understand more how the event loop of javascript works.

Keep in mind this phrase for a moment: "The overall idea behind comments is to capture information that was in the mind of the designer but couldn't be represented in the code."

I don't write c code, I never did and I don't plan to do so in the next few months, but sometimes I need to read some c code of open source libs to understand something, and in the case of event loop I needed to read the libuv code, let me show you the code to explain how this relates with the topic.

```c
int uv_run(uv_loop_t* loop, uv_run_mode mode) {
  int timeout;
  int r;
  int can_sleep;
 
  r = uv__loop_alive(loop);
  if (!r)
    uv__update_time(loop);

  /* Maintain backwards compatibility by processing timers before entering the
   * while loop for UV_RUN_DEFAULT. Otherwise timers only need to be executed
   * once, which should be done after polling in order to maintain proper
   * execution order of the conceptual event loop. */
  if (mode == UV_RUN_DEFAULT && r != 0 && loop->stop_flag == 0) {
    uv__update_time(loop);
    uv__run_timers(loop);
  }
 
  while (r != 0 && loop->stop_flag == 0) {
    can_sleep =
        uv__queue_empty(&loop->pending_queue) &&
        uv__queue_empty(&loop->idle_handles);

    uv__run_pending(loop);
    uv__run_idle(loop);
    uv__run_prepare(loop);
   
    ...
   
    /* Process immediate callbacks (e.g. write_cb) a small fixed number of
     * times to avoid loop starvation.*/
    for (r = 0; r < 8 && !uv__queue_empty(&loop->pending_queue); r++)
      uv__run_pending(loop);

    /* Run one final update on the provider_idle_time in case uv__io_poll
     * returned because the timeout expired, but no events were received. This
     * call will be ignored if the provider_entry_time was either never set (if
     * the timeout == 0) or was already updated b/c an event was received.
     */
    uv__metrics_update_idle_time(loop);
   
    ...
  }

  /* The if statement lets gcc compile it to a conditional store. Avoids
   * dirtying a cache line.
   */
  if (loop->stop_flag != 0)
    loop->stop_flag = 0;
   
  return r;
}
```

See how some branches of the code have comments to explain what they are made for and you probably couldn't guess by just reading? I didn't find the libuv code complex or spaghetti like. Still, if the comment wasn't there I would need a lot of time to understand why exists a pending_queue in the middle of the while loop or why this last if exists. The magic keyword for this is context, I don't have the context of the libuv project and thanks to the comments I don't need to dive so deep in the codebase to understand something, the comments gives me the context!

Sometimes you will get a task to create a state machine of a complex domain of your job and for this you need to translate a lot of business's logic into your code, if you are a good engineer you will create an understandable code to solve this issue without a problem. However, this isn't a guarantee that, if the company find a bug later on and you aren't more in the company, the engineer who picks up the ticket that never heard about this business's logic will not have a hard time to understand what the code are doing.

This is where the comments shine and should be used, you don't need to write comments often and a lot of time you don't need to write them at all, but sometimes, it's better to write a comment to clarify some business's logic. Don't let your ego ruin the day of your friends at work, if someone don't understand the business's logic or your code consider write some comments to help them do their work, this avoid some @ in your discord / slack that could be resolved with couple lines of comments.
