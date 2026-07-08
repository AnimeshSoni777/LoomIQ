import inspect
from vanna.core.user import User
from vanna.core.user.request_context import RequestContext
from vanna import Agent

print("---- User fields ----")
print(User.model_fields)

print("\n---- RequestContext fields ----")
print(RequestContext.model_fields)

print("\n---- Agent.__init__ signature ----")
print(inspect.signature(Agent.__init__))