from rest_framework.renderers import JSONRenderer

class GameSpaceJSONRenderer(JSONRenderer):
    def render(self, data, accepted_media_type=None, renderer_context=None):
        status_code = renderer_context['response'].status_code
        
        # Default structure
        response_data = {
            "success": True,
            "data": data
        }

        # If it's an error (400, 404, 500, etc.)
        if status_code >= 400:
            response_data["success"] = False
            response_data["error"] = data
            if "data" in response_data:
                del response_data["data"]
        
        return super().render(response_data, accepted_media_type, renderer_context)